require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let db = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("🔥 Firebase initialized successfully.");
  } else {
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT not found in .env. Firebase sync disabled.");
  }
} catch (e) {
  console.error("❌ Failed to initialize Firebase:", e);
}

// Initialize Gemini
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("🧠 Gemini AI initialized.");
}

// Mathematical Goals Generator
function getMathematicalGoal(dayNum) {
  const month = Math.ceil(dayNum / 30);
  let dsaTopic = "Revision & Mocks"; let dsaQ = 2;
  if (dayNum <= 1) dsaTopic = "Greedy (Medium/Hard)";
  else if (dayNum <= 13) dsaTopic = "Binary Trees";
  else if (dayNum <= 21) dsaTopic = "Binary Search Trees";
  else if (dayNum <= 26) dsaTopic = "Heaps";
  else if (dayNum <= 41) dsaTopic = "Graphs";
  else if (dayNum <= 51) dsaTopic = "DP Introduction";
  else if (dayNum <= 66) dsaTopic = "DP Mastery";
  else if (dayNum <= 73) dsaTopic = "Tries";
  else if (dayNum <= 81) dsaTopic = "Advanced Strings";
  else { dsaTopic = "Spaced Repetition & Mocks"; dsaQ = 0; }

  let aiTopic = "AI Maintenance";
  if (month === 1) aiTopic = "Data (NumPy/Pandas) & Scikit-Learn";
  else if (month === 2) aiTopic = "PyTorch & CNNs";
  else if (month === 3) aiTopic = "Transformers & RAG";
  else if (month === 4) aiTopic = "MLOps & System Design";

  let projTopic = "Portfolio Polish";
  if (month === 1) projTopic = "Throwaway ML Scripts";
  else if (month === 2) projTopic = "Project 1: React + ML Pipeline";
  else if (month === 3) projTopic = "Project 2: RAG LLM App";
  else if (month === 4) projTopic = "Finish Project 2 & Resume";

  return { dsaTopic, dsaQ, aiTopic, projTopic };
}

// Initialize Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;
const chatMemory = {}; // Short-term conversational memory

if (token) {
  bot = new TelegramBot(token, { polling: true });
  console.log("🤖 Telegram Bot initialized.");

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to the Google Prep Master Protocol! Your Chat ID is: " + chatId + "\nSave this ID in your .env file to receive reminders.");
  });

  // Handle Conversational Messages for the AI Agent
  bot.on('message', async (msg) => {
    if (msg.text === '/start' || !msg.text) return;
    if (!ai || !db) {
      bot.sendMessage(msg.chat.id, "⚠️ I am not fully initialized yet. Please check API keys and Firebase.");
      return;
    }

    const chatId = msg.chat.id;
    
    // Determine the current day (We calculate days elapsed since July 12, 2026)
    const startDate = new Date(2026, 6, 12);
    const now = new Date();
    let dayNum = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (dayNum < 1) dayNum = 1; // Fallback if tested before start date
    
    const goal = getMathematicalGoal(dayNum);
    
    // Manage Memory & Context from Firebase
    const docRef = db.collection('timetable').doc('userProgress');
    const doc = await docRef.get();
    
    let chatMemory = {};
    let pushedTasks = [];
    let generatedSchedules = {};
    
    if (doc.exists) {
      const data = doc.data();
      if (data.chatMemory) chatMemory = data.chatMemory;
      if (data.pushedTasks) pushedTasks = data.pushedTasks;
      if (data.generatedSchedules) generatedSchedules = data.generatedSchedules;
    }
    
    if (!chatMemory[chatId]) chatMemory[chatId] = [];

    const targetDayIdx = dayNum - 1;
    let existingSchedule = generatedSchedules[targetDayIdx] ? JSON.stringify(generatedSchedules[targetDayIdx], null, 2) : "None generated yet.";
    
    const pushedText = pushedTasks.length > 0 ? `\nPENDING TASKS FROM YESTERDAY:\n${pushedTasks.map(t => `- ${t}`).join('\n')}\nYou MUST include these in today's schedule.` : '';

    // Format conversation history
    const historyText = chatMemory[chatId].map(m => `${m.role === 'user' ? 'YOU' : 'COACH'}: ${m.text}`).join('\n');
    
    const dateLabel = now.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `[SYSTEM INSTRUCTION]
You are a friendly, encouraging, and highly organized productivity assistant. Your goal is to help the user build an optimal daily schedule to reach their goals.
Today is ${dateLabel} (Day ${dayNum} of the 153-day Google Protocol).

MATHEMATICAL GOALS FOR TODAY:
- DSA: ${goal.dsaTopic} (${goal.dsaQ} questions)
- AI: ${goal.aiTopic}
- Project Work: ${goal.projTopic}
${pushedText}

CURRENT SCHEDULE FOR TODAY:
${existingSchedule}

YOUR DIRECTIVES:
1. You are having an ongoing conversation with the user to figure out their constraints for today (e.g. start time, fixed events).
2. If the user ALREADY has a CURRENT SCHEDULE FOR TODAY and they are just saying "Hey" or chatting normally, DO NOT generate a new JSON. Just reply naturally acknowledging that their schedule is already locked in and ask how they are doing.
3. If they DON'T have a schedule yet, ask them gently when they plan to start and if they have any fixed plans.
4. ONLY if they provide constraints OR explicitly ask to change their existing schedule, you MUST output a fully optimized daily schedule in a JSON array format ENCLOSED IN \`\`\`json AND \`\`\`.
5. The JSON array MUST have blocks with: "dur" (e.g. "1.5h"), "label" (string), "cat" ("dsa"|"course"|"life"|"admin"|"break"), and "time" ("08:00").
6. When outputting the JSON, you MUST also include a friendly, encouraging message alongside it.

[CHAT HISTORY]
${historyText}
YOU: ${msg.text}
COACH:`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      let rawText = response.text.trim();
      
      // Save memory to Firebase
      chatMemory[chatId].push({ role: 'user', text: msg.text });
      chatMemory[chatId].push({ role: 'model', text: rawText });
      if (chatMemory[chatId].length > 10) chatMemory[chatId].splice(0, 2); // Keep last 5 exchanges
      await docRef.set({ chatMemory }, { merge: true });

      // Check if the AI generated a JSON schedule
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      let replyText = rawText;

      if (jsonMatch) {
        // Schedule generated!
        const jsonStr = jsonMatch[1].trim();
        replyText = rawText.replace(jsonMatch[0], '').trim(); // Remove JSON from user reply
        
        const generatedBlocks = JSON.parse(jsonStr);

        generatedSchedules[targetDayIdx] = generatedBlocks;
        await docRef.set({ generatedSchedules, pushedTasks: [] }, { merge: true });
        
        replyText += "\n\n✅ *Schedule Locked In. Open your React Dashboard.*";
      }

      bot.sendMessage(chatId, replyText);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Failed to generate or parse schedule. Error: " + err.message);
    }
  });

  // Interactive Callback Handlers
  bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;

    if (!db) {
      bot.answerCallbackQuery(callbackQuery.id, { text: 'Database not connected.', show_alert: true });
      return;
    }

    try {
      const docRef = db.collection('timetable').doc('userProgress');
      const doc = await docRef.get();
      
      if (data === 'push_missed') {
        let pendingMissed = doc.data().pendingMissed || [];
        let pushedTasks = doc.data().pushedTasks || [];
        pushedTasks = [...pushedTasks, ...pendingMissed];
        
        await docRef.set({ pushedTasks, pendingMissed: [] }, { merge: true });
        bot.editMessageText(message.text + "\n\n🔄 Tasks pushed to tomorrow! I will include them in your next schedule.", {
          chat_id: message.chat.id,
          message_id: message.message_id
        });
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Pushed to tomorrow!' });
      } else if (data === 'mark_all_done') {
        bot.editMessageText(message.text + "\n\n✅ Awesome. I've noted that you finished them.", {
          chat_id: message.chat.id,
          message_id: message.message_id
        });
        bot.answerCallbackQuery(callbackQuery.id, { text: 'Marked as done!' });
        await docRef.set({ pendingMissed: [] }, { merge: true });
      }
    } catch (err) {
      console.error(err);
      bot.answerCallbackQuery(callbackQuery.id, { text: 'Error processing action.' });
    }
  });
}

// Nightly Enforcer Cron Job
cron.schedule('0 23 * * *', async () => {
  if (!db || !ai || !bot) return;
  const targetChatId = process.env.TELEGRAM_CHAT_ID;
  if (!targetChatId) return;

  try {
    const doc = await db.collection('timetable').doc('userProgress').get();
    if (!doc.exists) return;
    const data = doc.data();
    const checked = data.checked || {};
    const generatedSchedules = data.generatedSchedules || {};

    const startDate = new Date(2026, 6, 12);
    const now = new Date();
    let dayNum = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (dayNum < 1) dayNum = 1;
    const targetDayIdx = dayNum - 1;

    let missedBlocks = [];
    const todayBlocks = generatedSchedules[targetDayIdx];
    
    if (todayBlocks && Array.isArray(todayBlocks)) {
      todayBlocks.forEach((block, idx) => {
        const blockId = `${targetDayIdx}-ai-${idx}`;
        // Ignore break and life blocks
        if (!checked[blockId] && block.cat !== 'break' && block.cat !== 'life') {
          missedBlocks.push(block.label);
        }
      });
    }

    if (missedBlocks.length > 0) {
      const prompt = `You are a creative, highly motivating productivity assistant. 
The user failed to complete the following tasks today:
${missedBlocks.join('\n')}

Generate a short, creative, engaging Telegram message (max 3 sentences) calling them out on missing these tasks. Be slightly disappointed but encouraging for tomorrow.`;

      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      let rawText = response.text.trim();

      const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Push to Tomorrow ➡️", callback_data: `push_missed` },
              { text: "I finished them! ✅", callback_data: `mark_all_done` }
            ]
          ]
        }
      };
      
      await db.collection('timetable').doc('userProgress').set({ pendingMissed: missedBlocks }, { merge: true });
      bot.sendMessage(targetChatId, `⚠️ Nightly Review\n\n${rawText}`, opts);
    } else {
      bot.sendMessage(targetChatId, `🎉 Nightly Review\n\nIncredible work today! You completed everything on your schedule. Rest up for tomorrow.`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});

// Frontend API Endpoints
app.get('/api/progress', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const doc = await db.collection('timetable').doc('userProgress').get();
    if (!doc.exists) {
      return res.json({ checked: {}, swappedBlocks: {}, ignitionTimes: {}, customEvents: {}, generatedSchedules: {} });
    }
    const data = doc.data();
    res.json({
      checked: data.checked || {},
      swappedBlocks: data.swappedBlocks || {},
      ignitionTimes: data.ignitionTimes || {},
      customEvents: data.customEvents || {},
      generatedSchedules: data.generatedSchedules || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/progress', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const { checked, swappedBlocks, ignitionTimes, customEvents, generatedSchedules } = req.body;
    await db.collection('timetable').doc('userProgress').set({
      checked: checked || {},
      swappedBlocks: swappedBlocks || {},
      ignitionTimes: ignitionTimes || {},
      customEvents: customEvents || {},
      generatedSchedules: generatedSchedules || {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
