import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, BrainCircuit, Code2, 
  Dumbbell, Coffee, ChevronRight, ChevronLeft, Target, ShieldCheck, Clock, Plus, Sun, Moon
} from "lucide-react";

// ─── QUOTES ────────────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.", author: "Kobe Bryant" },
  { text: "There's no shortcut. I work on my game every single day.", author: "Michael Phelps" },
  { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
  { text: "Hard days are the best because that's when champions are made.", author: "Gabby Douglas" },
  { text: "It's not the will to win that matters. It's the will to prepare to win that matters.", author: "Bear Bryant" },
];

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const CAT_CONFIG = {
  dsa:    { color: "var(--accent-gold)", icon: Code2 },
  course: { color: "var(--accent-blue)", icon: BrainCircuit },
  life:   { color: "var(--accent-green)", icon: Dumbbell },
  admin:  { color: "var(--text-secondary)", icon: ShieldCheck },
  break:  { color: "var(--text-tertiary)", icon: Coffee },
};

function timeToMins(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minsToTime(m) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function parseDur(durStr) {
  if (durStr.includes('h')) return parseFloat(durStr) * 60;
  return parseInt(durStr);
}

function minsToDur(m) {
  if (m % 60 === 0) return `${m / 60}h`;
  if (m > 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m`;
}

function format12Hour(timeStr) {
  if (!timeStr) return "";
  let [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  hour = hour % 24; // Normalize to a 24-hour cycle for crossing midnight
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function calculateEndTime(startTime, dur) {
  if (!startTime || !dur) return "";
  let startMins = timeToMins(startTime);
  return minsToTime(startMins + parseDur(dur));
}

// ─── SCHEDULE ENGINE (DYNAMIC) ────────────────────────────────────────────────
function buildDynamicSchedule(ignitionTimes = {}, customEvents = {}, generatedSchedules = {}) {
  const start = new Date(2026, 6, 12); // July 12, 2026
  const end = new Date(2026, 11, 5); // Dec 5, 2026

  const days = [];
  let dayNum = 1;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const isRest = dayNum % 7 === 0;
    const date = new Date(d);
    const dateLabel = date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
    const shortLabel = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    const month = Math.ceil(dayNum / 30);
    
    // Topics
    let dsaTopic = "Revision & Mocks"; let dsaQ = 2;
    if (dayNum <= 10) dsaTopic = "Greedy (Medium/Hard)";
    else if (dayNum <= 22) dsaTopic = "Binary Trees";
    else if (dayNum <= 30) dsaTopic = "Binary Search Trees";
    else if (dayNum <= 35) dsaTopic = "Heaps";
    else if (dayNum <= 50) dsaTopic = "Graphs";
    else if (dayNum <= 60) dsaTopic = "DP Introduction";
    else if (dayNum <= 75) dsaTopic = "DP Mastery";
    else if (dayNum <= 82) dsaTopic = "Tries";
    else if (dayNum <= 90) dsaTopic = "Advanced Strings";
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

    // Floating Blocks (No fixed times)
    let floatingBlocks = [];
    if (isRest) { 
      floatingBlocks = [
        { dur: "1h", label: "Weekly Check-in: Metrics & Plan", cat: "admin" },
        { dur: "45m", label: "Web Dev Course", cat: "course" },
        { dur: "1h", label: `ML Course: ${aiTopic}`, cat: "course" },
        { dur: "2h", label: "Buffer: Catch up missed topics", cat: "break", isBuffer: true },
        { dur: "4h", label: "Deep Rest & Recovery", cat: "life" },
      ];
    } else if (date.getDay() === 6) { 
      floatingBlocks = [
        { dur: "2h", label: "LeetCode Weekly Contest + Upsolving", cat: "dsa" },
        { dur: "30m", label: "Deep Rest (Non-Screen)", cat: "break" },
        { dur: "45m", label: "Web Dev Course", cat: "course" },
        { dur: "1h", label: `ML Course: ${aiTopic}`, cat: "course" },
        { dur: "1h", label: "Lunch & Walk", cat: "break" },
        { dur: "1.25h", label: `Heavy Coding Part 1: ${projTopic}`, cat: "course" },
        { dur: "20m", label: "Mindful Break", cat: "break" },
        { dur: "1.25h", label: `Heavy Coding Part 2: ${projTopic}`, cat: "course" },
        { dur: "1h", label: "Workout", cat: "life" },
        { dur: "2h", label: "Free Time / Life", cat: "life", isBuffer: true },
      ];
    } else { 
      floatingBlocks = [
        { dur: "15m",  label: "Active Recall: Yesterday's concept", cat: "dsa" },
        { dur: "1.5h", label: `DSA Deep Work: ${dsaTopic}`, cat: "dsa" },
        { dur: "20m",  label: "Deep Rest (Non-Screen)", cat: "break" },
        { dur: "45m",  label: "Spaced Review: 2 problems cold", cat: "dsa" },
        { dur: "45m",  label: "Web Dev Course", cat: "course" },
        { dur: "1h",   label: "Lunch & Walk", cat: "break" },
        { dur: "1h",   label: `ML Course: ${aiTopic}`, cat: "course" },
        { dur: "1h",   label: `Project Building: ${projTopic}`, cat: "course" },
        { dur: "1h",   label: "Workout", cat: "life" },
        { dur: "30m",  label: "Freshen up / Snack", cat: "break" },
        { dur: "1.5h", label: `Flexible Buffer: Extra Study`, cat: "course", isBuffer: true },
        { dur: "1.5h", label: "Free Time / Dinner", cat: "break", isBuffer: true },
        { dur: "15m",  label: "Daily Log: Tomorrow's plan", cat: "admin" },
      ];
    }

    // Dynamic Packing Algorithm
    const dayIdx = dayNum - 1;
    const startStr = ignitionTimes[dayIdx] || (isRest ? "10:00" : "08:00");
    let currentMins = timeToMins(startStr);
    
    // Scientific Lateness Compression (Starts shrinking buffers if started after 9:00 AM)
    const lateness = Math.max(0, currentMins - 540); // 540 = 09:00 AM
    let compressibleTime = 0;
    
    for (let b of floatingBlocks) {
      if (b.isBuffer) {
        b.originalDur = parseDur(b.dur);
        compressibleTime += b.originalDur;
      }
    }

    if (lateness > 0 && compressibleTime > 0) {
      const shrinkRatio = Math.max(0, 1 - (lateness / compressibleTime));
      const newBlocks = [];
      for (let b of floatingBlocks) {
        if (b.isBuffer) {
          const newDur = Math.round(b.originalDur * shrinkRatio);
          if (newDur >= 15) {
            newBlocks.push({ ...b, dur: minsToDur(newDur) });
          }
        } else {
          newBlocks.push(b);
        }
      }
      floatingBlocks = newBlocks;
    }

    const dayEvents = (customEvents[dayIdx] || []).map((e, idx) => ({
      isCustom: true, label: `[FIXED] ${e.title}`, time: e.time, dur: e.dur, cat: 'life',
      startMins: timeToMins(e.time),
      endMins: timeToMins(e.time) + parseDur(e.dur),
      id: `${dayIdx}-fixed-${idx}`
    })).sort((a,b) => a.startMins - b.startMins);

    let finalBlocks = [];
    let eventIndex = 0;

    for (const fb of floatingBlocks) {
      let blockDur = parseDur(fb.dur);
      
      // Check collision with fixed custom events
      let pushed = true;
      while (pushed) {
        pushed = false;
        if (eventIndex < dayEvents.length) {
          const ev = dayEvents[eventIndex];
          if (currentMins >= ev.startMins && currentMins < ev.endMins) {
            currentMins = ev.endMins; // Jump inside
            pushed = true;
            eventIndex++;
          } else if (currentMins < ev.startMins && currentMins + blockDur > ev.startMins) {
            currentMins = ev.endMins; // Push whole block to after event
            pushed = true;
            eventIndex++;
          }
        }
      }

      finalBlocks.push({ ...fb, time: minsToTime(currentMins), id: `${dayIdx}-float-${finalBlocks.length}` });
      currentMins += blockDur;
    }

    // Merge custom events into timeline
    for (const ev of dayEvents) {
      finalBlocks.push(ev);
    }
    
    // Sort timeline chronologically
    finalBlocks.sort((a, b) => timeToMins(a.time) - timeToMins(b.time));

    if (generatedSchedules[dayIdx] && Array.isArray(generatedSchedules[dayIdx])) {
      const aiBlocks = generatedSchedules[dayIdx].map((b, idx) => ({
        ...b,
        id: `${dayIdx}-ai-${idx}`
      }));
      days.push({ dayNum, dateLabel, shortLabel, date, blocks: aiBlocks, isRest, isAiGenerated: true, dsa: { topic: dsaTopic, q: dsaQ }, quoteIdx: (dayNum - 1) % QUOTES.length });
    } else {
      days.push({ dayNum, dateLabel, shortLabel, date, blocks: finalBlocks, isRest, isAiGenerated: false, dsa: { topic: dsaTopic, q: dsaQ }, quoteIdx: (dayNum - 1) % QUOTES.length });
    }
    
    dayNum++;
  }
  return days;
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────
function ProgressRing({ radius, stroke, progress }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
      <circle stroke="var(--glass-border)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <motion.circle stroke="var(--accent-gold)" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference + ' ' + circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1, ease: "easeOut" }} r={normalizedRadius} cx={radius} cy={radius} />
    </svg>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [selectedDay, setSelectedDay] = useState(() => parseInt(localStorage.getItem('timetable_day') || "0", 10));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [checked, setChecked] = useState({});
  const [ignitionTimes, setIgnitionTimes] = useState({});
  const [customEvents, setCustomEvents] = useState({});
  const [generatedSchedules, setGeneratedSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // New Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "Going Out", time: "14:00", dur: "3h" });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_URL}/api/progress`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setChecked(data.checked || {});
          setIgnitionTimes(data.ignitionTimes || {});
          setCustomEvents(data.customEvents || {});
          setGeneratedSchedules(data.generatedSchedules || {});
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('timetable_day', selectedDay);
    fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked, ignitionTimes, customEvents, generatedSchedules })
    }).catch(err => console.error("Sync failed:", err));
  }, [checked, ignitionTimes, customEvents, generatedSchedules, selectedDay, isLoading]);

  const schedule = useMemo(() => buildDynamicSchedule(ignitionTimes, customEvents, generatedSchedules), [ignitionTimes, customEvents, generatedSchedules]);
  const validDay = Math.min(Math.max(0, selectedDay), schedule.length - 1);
  const today = schedule[validDay];
  const quote = QUOTES[today.quoteIdx];

  const dayProg = useMemo(() => {
    const done = today.blocks.filter(b => checked[b.id] !== undefined).length;
    const total = today.blocks.length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [checked, today]);

  const overall = useMemo(() => {
    const total = schedule.reduce((a, d) => a + d.blocks.length, 0);
    const done = Object.keys(checked).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [checked, schedule]);

  const toggle = (id) => setChecked(c => {
    const n = { ...c };
    if (n[id] !== undefined) delete n[id]; else n[id] = validDay;
    return n;
  });

  const handleIgnitionChange = (e) => {
    const time = e.target.value;
    setIgnitionTimes(prev => ({ ...prev, [validDay]: time }));
  };

  const handleAddEvent = () => {
    setCustomEvents(prev => {
      const existing = prev[validDay] || [];
      return { ...prev, [validDay]: [...existing, newEvent] };
    });
    setShowEventModal(false);
  };

  return (
    <>
      <div className="bg-glow" />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        
        {/* SIDEBAR */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-panel" style={{ width: 280, margin: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 24, borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <ProgressRing radius={28} stroke={4} progress={overall.pct} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 700 }}>{overall.pct}%</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", letterSpacing: 1 }}>MASTER PROTOCOL</div>
                <div className="text-gradient-gold" style={{ fontSize: 18, fontWeight: 800 }}>Google Prep</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {schedule.map((d, i) => {
              const active = i === validDay;
              const doneCount = d.blocks.filter(b => checked[b.id] !== undefined).length;
              return (
                <button key={i} onClick={() => setSelectedDay(i)} style={{ width: "100%", padding: "12px 16px", marginBottom: 8, borderRadius: 12, textAlign: "left", background: active ? "var(--glass-bg-active)" : "transparent", border: `1px solid ${active ? "var(--glass-border)" : "transparent"}`, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "var(--text-primary-active)" : "var(--text-secondary)" }}>{d.shortLabel}</div>
                    {d.dsa && <div style={{ fontSize: 10, color: active ? "var(--accent-gold)" : "var(--text-tertiary)", marginTop: 2 }}>{d.dsa.topic}</div>}
                  </div>
                  {(doneCount === d.blocks.length && d.blocks.length > 0) && <Target size={14} color="var(--accent-gold)" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* MAIN DASHBOARD */}
        <div style={{ flex: 1, padding: "16px 16px 16px 0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: "32px 48px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
            
            {/* Header Controls (Ignition + Add Event) */}
            <div style={{ position: "absolute", top: 24, right: 48, display: "flex", gap: 16, alignItems: "center" }}>
              <button 
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)", cursor: "pointer" }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", padding: "6px 16px", borderRadius: 99 }}>
                <Clock size={14} color="var(--accent-gold)" />
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>IGNITION:</span>
                <input 
                  type="time" 
                  value={ignitionTimes[validDay] || (today.isRest ? "10:00" : "08:00")}
                  onChange={handleIgnitionChange}
                  style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 14, fontWeight: 700, outline: "none", cursor: "pointer", fontFamily: "var(--font-main)", colorScheme: theme === 'dark' ? "dark" : "light" }}
                />
              </div>
              <button 
                onClick={() => setShowEventModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", padding: "8px 16px", borderRadius: 99, color: "var(--text-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                <Plus size={14} /> Add Event
              </button>
            </div>

            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                {today.isAiGenerated && (
                  <div style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid var(--accent-blue)", color: "var(--accent-blue)", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>AI SCHEDULE</div>
                )}
                <div style={{ fontSize: 14, color: "var(--accent-gold)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Day {today.dayNum} of 153 {today.isRest && "· Rest & Recovery"}</div>
              </div>
              <h1 className="text-gradient" style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>{today.dateLabel}</h1>
              <div style={{ marginTop: 24, maxWidth: 600 }}>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.5 }}>"{quote.text}"</p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8, textTransform: "uppercase", letterSpacing: 1 }}>— {quote.author}</p>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: 40 }}>
              <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.8, color: dayProg.pct === 100 ? "var(--accent-gold)" : "var(--text-primary)" }}>{dayProg.pct}<span style={{ fontSize: 24, color: "var(--text-tertiary)" }}>%</span></div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 12, letterSpacing: 1 }}>{dayProg.done} / {dayProg.total} COMPLETED</div>
            </div>
          </motion.div>

          {/* TIMELINE */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ flex: 1, padding: "24px 48px", overflowY: "auto", position: "relative" }}>
            <div style={{ position: "absolute", left: 104, top: 48, bottom: 48, width: 2, background: "var(--glass-border)", zIndex: 0 }} />
            <AnimatePresence>
              {today.blocks.map((block, idx) => {
                const done = checked[block.id] !== undefined;
                const config = CAT_CONFIG[block.cat] || CAT_CONFIG.admin;
                const Icon = config.icon;
                const isBreak = block.cat === "break";
                const isFixed = block.isCustom;

                return (
                  <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={block.id} style={{ display: "flex", gap: 32, marginBottom: 24, position: "relative", zIndex: 1, opacity: done ? 0.4 : 1 }}>
                    <div style={{ width: 120, textAlign: "right", paddingTop: 16 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{format12Hour(block.time)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{block.dur}</div>
                    </div>
                    <div style={{ width: 48, display: "flex", justifyContent: "center", paddingTop: 12 }}>
                      <button onClick={() => !isFixed && toggle(block.id)} style={{ width: 32, height: 32, borderRadius: 16, background: done ? config.color : "var(--bg-dark)", border: `2px solid ${done ? config.color : "var(--glass-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: isFixed ? "default" : "pointer", transition: "all 0.2s" }}>
                        {done ? <CheckCircle2 size={18} color="var(--text-inverse)" /> : <Circle size={10} color="var(--text-tertiary)" />}
                      </button>
                    </div>
                    <div onClick={() => !isFixed && toggle(block.id)} style={{ flex: 1, padding: "20px 24px", borderRadius: 16, cursor: isFixed ? "default" : "pointer", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderLeft: `4px solid ${config.color}`, transition: "transform 0.2s, background 0.2s", transform: done ? "scale(0.98)" : "scale(1)" }} onMouseOver={e => !done && !isFixed && (e.currentTarget.style.background = "var(--glass-bg-hover)")} onMouseOut={e => e.currentTarget.style.background = "var(--glass-bg)"}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <Icon size={16} color={config.color} />
                        <span style={{ fontSize: 11, color: config.color, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{isFixed ? "Fixed Event" : (isBreak ? "Rest & Recovery" : block.cat)}</span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--text-primary)", textDecoration: done ? "line-through" : "none" }}>{block.label}</h3>
                      <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 8 }}>Ends at {format12Hour(calculateEndTime(block.time, block.dur))}</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* EVENT MODAL */}
      {showEventModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "var(--modal-bg)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="glass-panel" style={{ width: 400, padding: 32, background: "var(--bg-panel)" }}>
            <h2 style={{ fontSize: 20, marginBottom: 24, color: "var(--text-primary)" }}>Add Custom Event</h2>
            <input placeholder="Event Title (e.g. Going Out)" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={{ width: "100%", padding: 12, marginBottom: 16, background: "var(--glass-bg-input)", border: "none", color: "var(--text-primary)", borderRadius: 8 }} />
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} style={{ flex: 1, padding: 12, background: "var(--glass-bg-input)", border: "none", color: "var(--text-primary)", borderRadius: 8, colorScheme: theme === 'dark' ? "dark" : "light" }} />
              <input placeholder="Duration (e.g. 2h, 45m)" value={newEvent.dur} onChange={e => setNewEvent({...newEvent, dur: e.target.value})} style={{ flex: 1, padding: 12, background: "var(--glass-bg-input)", border: "none", color: "var(--text-primary)", borderRadius: 8 }} />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => setShowEventModal(false)} style={{ flex: 1, padding: 12, background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-primary)", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleAddEvent} style={{ flex: 1, padding: 12, background: "var(--accent-gold)", border: "none", color: "var(--text-inverse)", fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>Add Event</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}