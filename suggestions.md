# Project "Crack Google" — 5-Month Master Plan (v2)

**Window:** June 26, 2026 → November 26, 2026 (~22 weeks / 153 days)
**Starting point:** Striver A2Z DSA — 230/474 done, currently on Greedy (medium). AI/ML — starting from scratch. Projects — full-stack + AI hybrid preferred.
**Targets:**
- Finish all 474 Striver A2Z problems (244 new to go) + enough revision reps to cross **300–400 total LeetCode solves**.
- Go from zero to a working, practical AI/ML foundation (classical ML → one solid DL pass → applied NLP/LLM/RAG). Depth over breadth — this isn't a PhD, it's interview + project fuel.
- Ship **2 portfolio-grade projects** that mix full-stack engineering with real AI integration.
- Be mock-interview ready for Google-style loops (DSA + CS fundamentals + one ML-system-design narrative) by month 5.

**Why 5 months, not 4:** the math only works at a sustainable pace. 244 new problems + ~150 revision reps over ~100 weekdays is ~2–3 new problems/day + 1–2 revisions/day — doable at 4–5 hrs without burning out. Starting AI from zero needs real runway, not a crammed month. 5 months gives buffer weeks built in; if you find you're ahead, pull from Month 5's buffer to go deeper on system design or a 3rd project — don't compress the front.

**Hours:** Start at **4–5 hrs/day** (Month 1). Scale to 6 hrs by Month 2 once the routine is automatic, and only push to 6–7 in Month 4–5 crunch if recovery (sleep, one full rest day/week) is actually holding up. Hours scale on *demonstrated* sustainability, not on a fixed calendar date — check in with yourself weekly.

---

## Scientific principles this plan is built on

1. **Spaced repetition / active recall** — every topic gets touched 3 times: learn → solve fresh → re-solve cold weeks later. The "Spaced Review" block is not optional padding; it's where retention actually happens.
2. **Interleaving** — DSA and AI run in parallel every single week, never in separate blocks of months. Parallel tracks prevent the rust that comes from a 4-week break on any one skill, and switching cognitive modes (algorithmic vs. statistical thinking) is itself a known performance booster.
3. **Progressive overload** — hours and difficulty increase only after the prior load is comfortable for 1–2 weeks straight, not on a rigid calendar trigger.
4. **Time-blocking by cognitive peak** — hardest new DSA concepts in the morning peak window; AI theory (more lecture/absorption-style) in early afternoon; project work (flow-state, less raw cognitive load) in late afternoon/evening.
5. **Desirable difficulty** — once a topic is "done," problems from it are revisited cold (no notes) after a delay, not immediately re-read. Struggling a little on revision is the point.

---

## Month view (macro strategy)

### Month 1 — Foundation Reset (June 26 – July 25)
- **DSA:** Finish Greedy → Binary Trees (all variants: traversals, views, LCA, diameter) → Binary Search Trees.
- **AI:** Python for data (NumPy, Pandas), just enough linear algebra/calculus/probability to understand ML math (not a full course — targeted), Scikit-learn (regression, classification, basic model evaluation).
- **Projects:** No major build. 2–3 small throwaway ML scripts (e.g. a regression on a Kaggle dataset) purely to cement syntax and workflow.
- **Exit criteria:** Binary Trees + BST sections at 100% on Striver. Comfortable writing pandas/numpy/sklearn code without constantly looking up syntax.

### Month 2 — Graphs, DP Entry, and Deep Learning (July 26 – Aug 25)
- **DSA:** Heaps (if any gaps remain) → Graphs (BFS/DFS, shortest paths, MST, topological sort) → DP introduction (1D, 2D/grid DP).
- **AI:** PyTorch fundamentals, neural network basics (forward/backprop intuition, not just API calls), CNNs for a small vision task.
- **Projects:** **Project 1 kickoff** — pick a domain you already care about (F1 strategy is your natural home turf) and build a classical-ML-or-light-DL model with a genuinely good Next.js/React frontend, deployed.
- **Exit criteria:** Graphs section complete. Can explain backprop in your own words without notes. Project 1 has a working end-to-end pipeline (even if UI isn't polished yet).

### Month 3 — DP Mastery, Tries, and NLP/LLMs (Aug 26 – Sep 25)
- **DSA:** Finish DP (strings, MCM-pattern, partition DP) → Tries → remaining advanced strings/bit manipulation. **All 474 problems complete by end of this month.**
- **AI:** Transformers and attention (conceptual + minimal from-scratch implementation), HuggingFace ecosystem, embeddings, intro to RAG.
- **Projects:** **Project 1 polish + ship.** **Project 2 kickoff** — RAG-based LLM application over a real, personally meaningful dataset (this is where your full-stack + AI mix shines hardest).
- **Exit criteria:** Sheet at 474/474 (first full pass done). Project 1 fully deployed and demo-ready. Project 2 retrieval pipeline working.

### Month 4 — Consolidation and System Thinking (Sep 26 – Oct 25)
- **DSA:** Spaced repetition pass #1 across the *entire* sheet — focus only on medium/hard problems you flagged as shaky. Start timed mock sets (45–60 min, 2 problems).
- **AI:** MLOps basics (deployment, latency, monitoring at a conceptual level — enough to talk about it, not enough to need a separate cert), basic ML system design framing (how would you design a recommendation/ranking system — this is genuinely asked at Google-tier interviews).
- **Projects:** Finish Project 2 fully. Begin resume/portfolio rewrite in parallel (don't leave this to month 5).
- **Exit criteria:** Both projects deployed, documented, and demo-able in under 3 minutes each. First full revision pass of DSA sheet complete. Comfortable narrating one ML system design end-to-end.

### Month 5 — The Google Gauntlet (Oct 26 – Nov 26)
- **DSA:** Spaced repetition pass #2, hard-problems-only review, **weekly timed mock interviews** (peer, online platform, or self-timed). Pattern drilling on whatever shows up weakest in mocks.
- **AI:** Light maintenance only — no new topics. Polish the one ML-system-design narrative you'll actually tell in interviews.
- **Projects:** Resume, GitHub READMEs, portfolio site final polish. No new feature work unless a mock interview exposes a glaring gap.
- **Buffer:** This month has the most slack built in deliberately. If Months 1–4 ran over, this is where that debt gets paid down — not by compressing DSA, but by trimming AI depth or cutting to 1 strong project instead of 2.
- **Exit criteria:** You can sit a timed 45-min mock (2 mediums or 1 hard) and pass at a rate you're satisfied with. Both projects can be explained crisply. You have one well-rehearsed system-design story.

---

## Week view (the rhythm — applies every week, all 5 months)

| Day | Focus |
|---|---|
| Mon–Fri | Execution days (see Day view below) |
| Saturday | LeetCode weekly contest + upsolving in the morning; heavy project coding block in the afternoon |
| Sunday | **Buffer day.** Catch up on anything missed, light revision only, and actual rest. Do not schedule new content on Sundays — the plan only works if this day stays a release valve. |

**Weekly DSA quota (Months 1–3):** ~3 new problems + 2 revision re-solves per weekday → ~15 new + ~10 revision per week.
**Weekly DSA quota (Months 4–5):** flips — mostly revision + mocks, 0–1 new problems per weekday (only if sheet isn't finished yet).

---

## Day view (micro execution — Months 1–3, the "build" phase)

*Calibrated to 4–5 hrs/day starting point. Scale block lengths up proportionally as hours increase — ratios stay the same.*

**Block 1 — Deep work (morning peak), ~1.5–2 hrs**
- 15 min: active recall — explain yesterday's hardest DSA concept out loud or in writing, no notes.
- 60–75 min: new DSA concept + 2 new problems (timer-boxed, 25 min max per problem before looking at a hint).
- 30–45 min: spaced review — re-solve 2 problems from earlier topics, cold, timed.

**Block 2 — AI learning, ~1.5 hrs**
- Watch/read one focused unit, then immediately code it in a notebook. No passive watching without a code-along — this is the single highest-leverage rule in the AI track.

**Block 3 — Project work, ~1–1.5 hrs**
- Build/ship time on whichever project is active. End the block by writing down tomorrow's first concrete task (not "work on project" — something like "wire up the retrieval endpoint").

**Daily close, ~10 min**
- Log: problems solved (new vs. revision), one-line note on what felt shaky, tomorrow's specific DSA problems chosen in advance (removes morning decision fatigue).

*Months 4–5 day structure shifts: Block 1 becomes mock-interview-style timed sets, Block 2 shrinks to light AI maintenance/system-design rehearsal, Block 3 becomes resume/portfolio + project polish.*

---

## Dynamic adjustment rules

The day/week structure is intentionally decoupled from the month strategy so it can flex without breaking the overall plan:

- **If a DSA topic takes longer than planned:** borrow time from AI block, not from revision. New-topic depth matters more short-term than AI breadth; revision is what makes the sheet stick long-term — don't cut it.
- **If hours feel sustainable for 2 straight weeks:** increase the morning DSA block by 30 min before adding a 4th block elsewhere. Scale the block that's already working, not a new one.
- **If a week gets disrupted** (college exams, life): protect Sunday buffer and Saturday morning contest; everything else can compress. Don't try to "make up" lost hours by stacking — just resume the next week's plan as scheduled and let the buffer in Month 5 absorb the debt.
- **Weekly check-in (do this every Sunday, 10 min):** count actual new problems solved + actual revision reps. If consistently under target for 2+ weeks, the month-level scope (not the daily structure) needs to shrink — cut AI depth before cutting DSA, cut project polish before cutting DSA, in that order.

---

## Verification plan

- **Weekly metric:** LeetCode solved count, tracked new vs. revision separately. Target ~15 new + ~10 revision per week during Months 1–3.
- **Monthly metric:** one concrete, checkable milestone (see "Exit criteria" per month above) — not vague progress, an actual yes/no checklist.
- **From Month 2 onward:** weekly LeetCode virtual contest, tracked for time-to-solve trend, not just pass/fail.
- **From Month 4 onward:** weekly timed mock interview (2 problems, 45–60 min), self-graded on: did you get to a working solution, how close to optimal, how clean was the explanation.

---

## What this plan deliberately does NOT do

- It does not try to cover every AI subfield. Reinforcement learning, advanced MLOps, and research-paper-reading are explicitly out of scope — they're nice-to-haves that would dilute the 5 months you actually have.
- It does not treat "redoing the sheet" as re-solving all 474 from scratch. Revision means targeted re-solves of problems you flagged as shaky, done cold and timed — that's what produces retention, not re-reading solutions.
- It does not assume 6–8 hrs/day from day one. The plan is calibrated to start at 4–5 and earn its way up — front-loading max hours is the most common reason ambitious prep plans collapse by week 3.