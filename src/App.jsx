import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const HABITS = [
  { id: "water",   emoji: "💧", label: "Hydrated",        sublabel: "8 cups. Yes, all of them.",                     target: 8, unit: "cups",  color: "#60a5fa", points: 20 },
  { id: "move",    emoji: "🚶‍♀️", label: "Moved the body",  sublabel: "Walk, dance, chase something. It counts.",       target: 1, unit: "time",  color: "#f472b6", points: 25 },
  { id: "veggies", emoji: "🥦", label: "Ate a veggie",    sublabel: "Even if it was buried in something delicious.",   target: 1, unit: "time",  color: "#34d399", points: 20 },
  { id: "sleep",   emoji: "😴", label: "Slept 7+ hrs",    sublabel: "Log in the morning. Be honest with yourself.",   target: 1, unit: "night", color: "#a78bfa", points: 25 },
  { id: "mindful", emoji: "🍽️", label: "Mindful moment",  sublabel: "One meal where you actually tasted it. Pizza counts.", target: 1, unit: "day", color: "#fb923c", points: 15 },
];

const MEDS = [
  { id: "morning_med", emoji: "🌅", label: "Morning Diabetes Med", time: "Morning", color: "#f472b6", points: 30 },
  { id: "evening_med", emoji: "🌙", label: "Evening Diabetes Med", time: "Evening", color: "#a78bfa", points: 30 },
];

const LEVELS = [
  { min: 0,    name: "Just Getting Started",  emoji: "🌱" },
  { min: 100,  name: "Showing Up",            emoji: "✨" },
  { min: 300,  name: "Building Momentum",     emoji: "🔥" },
  { min: 600,  name: "In Her Groove",         emoji: "💪" },
  { min: 1000, name: "Tracey Tracey Season",  emoji: "👑" },
  { min: 1500, name: "Absolute Icon",         emoji: "🌟" },
];

const BADGES = [
  { id: "first_med",    emoji: "💊", label: "First Dose",       desc: "Took your first med",           check: (s) => s.totalMedDays >= 1 },
  { id: "three_streak", emoji: "🔥", label: "On Fire",          desc: "3-day streak",                  check: (s) => s.streak >= 3 },
  { id: "week_streak",  emoji: "🏆", label: "Week Strong",      desc: "7-day streak",                  check: (s) => s.streak >= 7 },
  { id: "hydration",    emoji: "💧", label: "Hydration Nation",  desc: "Hit water goal 5 days",        check: (s) => s.waterDays >= 5 },
  { id: "mover",        emoji: "🚶‍♀️", label: "She Moves",        desc: "Moved body 5 days",            check: (s) => s.moveDays >= 5 },
  { id: "century",      emoji: "💯", label: "100 Points",       desc: "Earned 100 total points",       check: (s) => s.totalPoints >= 100 },
  { id: "five_hundred", emoji: "⭐", label: "500 Club",         desc: "Earned 500 total points",       check: (s) => s.totalPoints >= 500 },
  { id: "all_habits",   emoji: "🎯", label: "Full Send",        desc: "Completed all habits in a day", check: (s) => s.fullDays >= 1 },
];

const EDUCATION = [
  {
    tag: "🍽️ Food & Sugar",
    title: "Why carbs hit different with diabetes",
    body: "When you eat carbs, your body breaks them into glucose. Without enough insulin (or with insulin resistance), that glucose stays in your blood longer than it should. The sneaky ones? White bread, rice, juice — they spike you fast. Fiber slows that down, which is literally why your doctor keeps saying 'eat more veggies.' The veggie habit isn't random.",
    stat: "Eating fiber with carbs can reduce blood sugar spikes by up to 50%",
    emoji: "📊",
  },
  {
    tag: "💊 Meds & Habits",
    title: "Your med works better when you move",
    body: "Exercise acts like a second dose of insulin — it helps your muscles absorb glucose from your blood WITHOUT needing insulin to do it. So when you take your med AND go for a walk? That's a power combo. Missing the walk doesn't cancel the med, but adding the walk makes the med stretch further. They're a team.",
    stat: "Even a 10-minute walk after eating can lower post-meal blood sugar significantly",
    emoji: "🤝",
  },
  {
    tag: "🫀 Body Signals",
    title: "What your body is actually saying",
    body: "Feeling tired after eating? That might be a blood sugar spike (and crash). Headache in the afternoon? Could be dehydration — which also messes with blood sugar. Foggy brain? Low blood sugar is a culprit. Your body is giving you real-time data. The more you track habits, the more patterns you'll start to see. That's not just wellness, that's INFORMATION.",
    stat: "Staying hydrated can improve insulin sensitivity — water and diabetes are directly connected",
    emoji: "🔍",
  },
  {
    tag: "😴 Sleep & Sugar",
    title: "Bad sleep literally spikes your blood sugar",
    body: "When you're sleep-deprived, your body produces more cortisol (stress hormone) which raises blood sugar. It also makes your cells more insulin-resistant — meaning your med has to work harder. One bad night isn't a crisis, but consistently sleeping under 7 hours is like adding a headwind to everything else you're doing. Sleep IS a diabetes management tool.",
    stat: "Poor sleep can raise fasting blood sugar by 23% — sleep is medicine",
    emoji: "📈",
  },
  {
    tag: "💊 Meds & You",
    title: "Why timing your meds matters",
    body: "Diabetes meds aren't like vitamins — they're timed to work with your meals and your body's natural rhythms. Taking them at the same time each day keeps the drug level in your blood consistent. Skipping or going irregular creates gaps where blood sugar can spike unchecked. The '30-day streak' goal isn't about perfection — it's about building the consistency that makes the med actually do its job.",
    stat: "Consistent med timing can improve A1C outcomes better than dose alone",
    emoji: "⏰",
  },
  {
    tag: "🧠 ADHD & Health",
    title: "Your ADHD brain and health habits",
    body: "ADHD makes habit-building genuinely harder — not because of willpower, but because the brain's reward system works differently. Immediate rewards feel more motivating than future benefits, which is why 'take your med so your A1C improves in 3 months' doesn't hit the same as 'take your med and get 30 points right now.' That's not a character flaw. That's neuroscience. This app is designed around how YOUR brain actually works.",
    stat: "External reward systems measurably improve medication adherence in people with ADHD",
    emoji: "🧬",
  },
  {
    tag: "🥦 Small Wins",
    title: "One veggie a day is actually science",
    body: "You don't need to go full salad-every-meal to see results. Studies show that adding just ONE serving of non-starchy vegetables per day can meaningfully improve blood sugar control over time. It's not about being perfect — it's about giving your body more fiber, more nutrients, and more tools to regulate glucose. One veggie. That's it. That's the whole strategy.",
    stat: "People who eat veggies daily have 14% lower risk of diabetes complications",
    emoji: "🌿",
  },
];

const KELLI_QUOTES = [
  "Tracey Tracey said: today we LIVE. 👑",
  "41 and still the funniest one in the room. Now hydrate.",
  "Your ADHD brain got you here. That IS the superpower.",
  "Natasha Rothwell didn't become iconic by skipping her meds.",
  "Every habit logged is a love letter to future Tracey.",
  "The girls that get it, GET it. That's you.",
  "You logged in. Already better than 'I'll start Monday.'",
  "The body is a temple. A fun temple. With good snacks.",
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getLevel(pts) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (pts >= l.min) lvl = l; }
  return lvl;
}

function getNextLevel(pts) {
  return LEVELS.find(l => l.min > pts) || null;
}

function computeStats(allData) {
  let totalPoints = 0, streak = 0, totalMedDays = 0, waterDays = 0, moveDays = 0, fullDays = 0;
  const days = Object.keys(allData).sort();
  for (const k of days) {
    const d = allData[k];
    const pts = (d.points || 0);
    totalPoints += pts;
    const habDone = HABITS.every(h => (d[h.id] || 0) >= h.target);
    const medDone = MEDS.every(m => d[m.id]);
    if (habDone && medDone) fullDays++;
    if ((d.water || 0) >= 8) waterDays++;
    if (d.move) moveDays++;
    if (medDone) totalMedDays++;
  }
  // streak
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const k = d.toISOString().split("T")[0];
    const day = allData[k] || {};
    const habDone = HABITS.every(h => (day[h.id] || 0) >= h.target);
    const medDone = MEDS.every(m => day[m.id]);
    if (!(habDone && medDone) && i > 0) break;
    if (habDone && medDone) streak++;
    d.setDate(d.getDate() - 1);
  }
  return { totalPoints, streak, totalMedDays, waterDays, moveDays, fullDays };
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function HabitCard({ habit, value, onChange }) {
  const done = value >= habit.target;
  const pct = Math.min((value / habit.target) * 100, 100);
  return (
    <div style={{
      background: done ? "#fffbeb" : "#fff",
      border: `3px solid ${done ? habit.color : "#f0e6d3"}`,
      borderRadius: "18px", padding: "16px 18px",
      position: "relative", overflow: "hidden",
      transition: "all 0.3s",
      boxShadow: done ? `0 4px 18px ${habit.color}33` : "0 2px 6px #d9722611",
    }}>
      {done && <div style={{
        position: "absolute", top: 0, right: 0,
        background: habit.color, color: "#fff",
        fontSize: "0.58rem", fontWeight: 900,
        padding: "4px 12px", borderBottomLeftRadius: "12px", letterSpacing: "0.1em",
      }}>LOCKED IN ✓</div>}

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{
          width: "44px", height: "44px",
          background: done ? habit.color : "#fef3e8",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", flexShrink: 0,
          transition: "all 0.3s",
        }}>{habit.emoji}</div>
        <div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: done ? habit.color : "#2c1a0e", marginBottom: "2px" }}>{habit.label}</div>
          <div style={{ color: "#9a7c65", fontSize: "0.7rem" }}>{habit.sublabel}</div>
          <div style={{ color: "#f59e0b", fontSize: "0.68rem", fontWeight: 700, marginTop: "2px" }}>+{habit.points} pts</div>
        </div>
      </div>

      <div style={{ background: "#f0e6d3", borderRadius: "99px", height: "6px", marginBottom: "12px" }}>
        <div style={{ background: habit.color, height: "100%", borderRadius: "99px", width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {habit.target === 1 ? (
          <button onClick={() => onChange(done ? 0 : 1)} style={{
            flex: 1, padding: "10px", borderRadius: "11px", border: "none",
            background: done ? habit.color : "#fef3e8",
            color: done ? "#fff" : "#9a7c65",
            fontWeight: 800, cursor: "pointer", fontSize: "0.82rem",
            fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
          }}>{done ? "✓ Done that!" : "Tap to log"}</button>
        ) : (
          <>
            <button onClick={() => onChange(Math.max(0, value - 1))} style={{ padding: "10px 16px", borderRadius: "11px", border: "none", background: "#fef3e8", color: "#9a7c65", fontWeight: 900, cursor: "pointer", fontSize: "1.1rem" }}>−</button>
            <button onClick={() => onChange(Math.min(habit.target + 4, value + 1))} style={{
              flex: 1, padding: "10px", borderRadius: "11px", border: "none",
              background: done ? habit.color : "#fef3e8",
              color: done ? "#fff" : "#2c1a0e",
              fontWeight: 800, cursor: "pointer", fontSize: "0.82rem",
              fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
            }}>{done ? `✓ ${value} cups!` : `+ a cup (${value}/${habit.target})`}</button>
          </>
        )}
      </div>
    </div>
  );
}

function MedCard({ med, taken, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      flex: 1, padding: "16px 12px",
      background: taken ? "linear-gradient(135deg, #92400e, #b45309)" : "#fff",
      border: `3px solid ${taken ? "#d97206" : "#f0e6d3"}`,
      borderRadius: "18px", cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: taken ? "0 6px 20px #d9720644" : "0 2px 6px #d9722611",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{med.emoji}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "0.9rem", fontWeight: 700, color: taken ? "#fef3c7" : "#2c1a0e", marginBottom: "3px" }}>{med.label}</div>
      <div style={{ fontSize: "0.68rem", color: taken ? "#fcd34d" : "#9a7c65", marginBottom: "6px" }}>{med.time}</div>
      <div style={{
        display: "inline-block", padding: "4px 12px", borderRadius: "99px",
        background: taken ? "#fef3c7" : "#fef3e8",
        color: taken ? "#92400e" : "#c4a882",
        fontSize: "0.68rem", fontWeight: 800,
      }}>{taken ? "✓ Taken! +30pts" : "Tap to log"}</div>
    </button>
  );
}

function EducationCard({ card }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: "linear-gradient(135deg, #fffbeb, #fef9f0)",
      border: "2px solid #f59e0b",
      borderRadius: "20px", padding: "18px 20px",
      boxShadow: "0 4px 16px #f59e0b22",
    }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{
          width: "44px", height: "44px", background: "#fef3c7",
          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", flexShrink: 0,
        }}>{card.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#d97206", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{card.tag}</div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#78350f", lineHeight: 1.3, marginBottom: "8px" }}>{card.title}</div>

          {expanded && (
            <div>
              <div style={{ color: "#92400e", fontSize: "0.82rem", lineHeight: 1.65, marginBottom: "12px" }}>{card.body}</div>
              <div style={{
                background: "#fef3c7", borderRadius: "12px", padding: "10px 14px",
                borderLeft: "4px solid #f59e0b",
              }}>
                <div style={{ color: "#78350f", fontSize: "0.75rem", fontWeight: 700, marginBottom: "2px" }}>📊 Did you know?</div>
                <div style={{ color: "#92400e", fontSize: "0.78rem", fontStyle: "italic" }}>{card.stat}</div>
              </div>
            </div>
          )}

          <button onClick={() => setExpanded(!expanded)} style={{
            marginTop: "10px", padding: "7px 16px", borderRadius: "99px",
            border: "2px solid #f59e0b", background: expanded ? "#f59e0b" : "transparent",
            color: expanded ? "#fff" : "#d97206", fontWeight: 800,
            cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Sora', sans-serif",
            transition: "all 0.2s",
          }}>{expanded ? "Got it ✓" : "Tell me more →"}</button>
        </div>
      </div>
    </div>
  );
}

function KelliCoach({ todayData, streak }) {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const ask = async () => {
    setOpen(true); setLoading(true); setMsg("");
    const completed = HABITS.filter(h => (todayData[h.id] || 0) >= h.target).map(h => h.label);
    const missed = HABITS.filter(h => (todayData[h.id] || 0) < h.target).map(h => h.label);
    const medsTaken = MEDS.filter(m => todayData[m.id]).map(m => m.label);
    const medsMissed = MEDS.filter(m => !todayData[m.id]).map(m => m.label);

    const prompt = `You are Kelli — Tracey's chaotic-confident, hilarious, Black girl magic, zero-filter accountability bestie. Think Natasha Rothwell's Kelli from Insecure: unfiltered internal monologue, says the truest thing in the funniest way, deeply loyal, never mean but always REAL.

Tracey (Tracey Tracey — her real self, not work Tracey) is 41, has ADHD AND diabetes, loves food, and is genuinely trying. She's tracking both habits AND her diabetes meds.

Today:
- Streak: ${streak} days
- Habits done: ${completed.length ? completed.join(", ") : "nothing yet"}
- Habits left: ${missed.length ? missed.join(", ") : "none!"}
- Meds taken: ${medsTaken.length ? medsTaken.join(", ") : "none yet"}
- Meds missed: ${medsMissed.length ? medsMissed.join(", ") : "all taken!"}

If any meds are missed, make sure to mention it — warmly but clearly. Meds are non-negotiable.
Write 3-4 sentences MAX in Kelli's voice. No bullets. Genuine, funny, warm. Don't say "bestie."`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setMsg(data.content?.find(b => b.type === "text")?.text || "Tracey. Log something AND take your meds. I love you.");
    } catch {
      setMsg("WiFi acting up but: take your meds Tracey Tracey. Then log a habit. In that order. 🧡");
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={ask} style={{
        width: "100%", padding: "15px", borderRadius: "16px",
        border: "3px solid #d97206",
        background: "linear-gradient(135deg, #92400e, #b45309)",
        color: "#fef3c7", fontWeight: 900, fontSize: "0.95rem",
        cursor: "pointer", fontFamily: "'Sora', sans-serif",
        marginBottom: open ? "12px" : 0,
        boxShadow: "0 6px 20px #92400e44", transition: "all 0.2s",
      }}>✨ Get Your Kelli Check-In</button>

      {open && (
        <div style={{
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          border: "2px solid #f59e0b", borderRadius: "16px",
          padding: "18px 20px", color: "#78350f",
          fontSize: "0.93rem", lineHeight: 1.7,
          fontStyle: "italic", fontFamily: "'Fraunces', Georgia, serif",
          minHeight: "70px", boxShadow: "0 4px 16px #f59e0b22",
        }}>
          {loading
            ? <span style={{ fontStyle: "normal", fontFamily: "'Sora', sans-serif", fontSize: "0.82rem", color: "#d97206" }}>Kelli is gathering her thoughts... 💭</span>
            : `"${msg}"`}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

const TABS = ["Today", "Progress", "Learn"];

export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const [allData, setAllData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tracey_v3") || "{}"); } catch { return {}; }
  });
  const [tab, setTab] = useState("Today");
  const [quoteIdx] = useState(() => Math.floor(Math.random() * KELLI_QUOTES.length));
  const [eduIdx] = useState(() => Math.floor(Math.random() * EDUCATION.length));
  const [confetti, setConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  const todayData = allData[today] || {};
  const stats = computeStats(allData);

  const save = (newToday) => {
    // compute today's points
    let pts = 0;
    for (const h of HABITS) if ((newToday[h.id] || 0) >= h.target) pts += h.points;
    for (const m of MEDS) if (newToday[m.id]) pts += m.points;
    const updated = { ...allData, [today]: { ...newToday, points: pts } };
    setAllData(updated);
    try { localStorage.setItem("tracey_v3", JSON.stringify(updated)); } catch {}

    // check badges
    const newStats = computeStats(updated);
    for (const badge of BADGES) {
      const had
