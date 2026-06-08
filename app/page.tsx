"use client";

import { FormEvent, useEffect, useState } from "react";

type WeekStatus = "Not Started" | "In Progress" | "Complete";

export default function Home() {
  const [examType, setExamType] = useState("SAT");
  const [currentScore, setCurrentScore] = useState(850);
  const [targetScore, setTargetScore] = useState(1200);
  const [testDate, setTestDate] = useState("");
  const [weakArea, setWeakArea] = useState("Math Problem Solving");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [submitted, setSubmitted] = useState(false);
  const [weekStatus, setWeekStatus] = useState<Record<string, WeekStatus>>({
    "Week 1": "Not Started",
    "Week 2": "Not Started",
    "Week 3": "Not Started",
    "Week 4": "Not Started",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("examPlanProgress");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Record<string, WeekStatus>;
      setWeekStatus((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore invalid data
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("examPlanProgress", JSON.stringify(weekStatus));
  }, [weekStatus]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const scorePrediction = (() => {
    const gap = targetScore - currentScore;
    if (gap <= 0) {
      return {
        percentage: 96,
        label: "Very likely",
        estimatedGain: 0,
        note: "Your current score already meets or exceeds your target.",
        message: "No gain needed — you already meet your target.",
      };
    }

    const now = new Date();
    const exam = testDate ? new Date(testDate) : null;
    const daysLeft = exam ? Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 56;
    const weeksLeft = Math.max(1, daysLeft / 7);
    const capacity = hoursPerWeek * weeksLeft;
    const gapFactor = Math.min(1, gap / 200);
    const studyFactor = Math.min(1.5, capacity / Math.max(20, gap * 1.5));
    let percentage = Math.round(30 + studyFactor * 50 - gapFactor * 20);
    percentage = Math.max(5, Math.min(98, percentage));

    let label = "Moderate";
    if (percentage >= 80) label = "Very likely";
    else if (percentage >= 60) label = "Likely";
    else if (percentage >= 40) label = "Uncertain";
    else label = "Challenging";

    // estimated gain: conservative fraction of the gap proportional to likelihood
    const estimatedGain = Math.round(Math.min(gap, (percentage / 100) * gap * 0.9));

    const baseNote = exam
      ? `Based on ${hoursPerWeek} hours/week over ${Math.ceil(weeksLeft)} weeks until your test date.`
      : `Based on ${hoursPerWeek} hours/week and your current timeline.`;

    const message = `${label}: With ${hoursPerWeek} hrs/week${exam ? ` for ~${Math.ceil(weeksLeft)} weeks` : ""}, the model estimates an average gain of ~${estimatedGain} points toward your goal.`;

    return {
      percentage,
      label,
      estimatedGain,
      note: baseNote,
      message,
    };
  })();

  const samplePlan = (() => {
    const header = `${examType} plan for ${testDate ? `test on ${testDate}` : "your target date"}`;
    const hoursText = `${hoursPerWeek} hrs/week`;

    if (examType === "ACT") {
      return {
        header,
        hoursText,
        weeks: [
          {
            title: "Week 1",
            subtitle: "Timed reading & science drills",
            description: `Use ${hoursPerWeek} hours this week to establish pacing and accuracy in reading and science.`,
          },
          {
            title: "Week 2",
            subtitle: "Math strategy sprint",
            description: `Focus on ACT math shortcuts and geometry problem-solving targeted to your weak area of ${weakArea}.`,
          },
          {
            title: "Week 3",
            subtitle: "English & source analysis",
            description: `Build grammar confidence and practice passage analysis for consistent scoring growth.`,
          },
          {
            title: "Week 4",
            subtitle: "Full ACT practice exams",
            description: `Complete full-length practice tests, review mistakes, and finalize pacing before ${testDate || "test day"}.`,
          },
        ],
      };
    }

    if (examType === "AP") {
      return {
        header,
        hoursText,
        weeks: [
          {
            title: "Week 1",
            subtitle: "Core concept review",
            description: `Build the foundation in your AP subject and align practice to classroom objectives.`,
          },
          {
            title: "Week 2",
            subtitle: "Essay & free-response prep",
            description: `Practice written responses and scoring guides for the AP exam format.`,
          },
          {
            title: "Week 3",
            subtitle: "Multiple choice mastery",
            description: `Strengthen recall and timing across the subject using ${hoursPerWeek} hours of focused review.`,
          },
          {
            title: "Week 4",
            subtitle: "Final review sprint",
            description: `Use targeted study sessions to polish your weak area and finalize exam-ready confidence.`,
          },
        ],
      };
    }

    return {
      header,
      hoursText,
      weeks: [
        {
          title: "Week 1",
          subtitle: "Diagnostic & strategy mapping",
          description: `Run a full diagnostic and map your performance to focus on ${weakArea.toLowerCase()}.`,
        },
        {
          title: "Week 2",
          subtitle: "Targeted practice blocks",
          description: `Commit ${hoursPerWeek} hours to targeted practice for the highest-value SAT skills.`,
        },
        {
          title: "Week 3",
          subtitle: "Timed section practice",
          description: `Build test endurance with timed reading and math sections while refining pacing.`,
        },
        {
          title: "Week 4",
          subtitle: "Review & confidence boost",
          description: `Wrap up with focused review, weak-area drills, and exam readiness checks before ${testDate || "test day"}.`,
        },
      ],
    };
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-14">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-500/25 to-transparent blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-8">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300 ring-1 ring-cyan-500/20">
                  Launch your exam prep
                </span>
                <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                  Exam Coach AI
                </h1>
                <p className="max-w-xl text-lg text-slate-300 sm:text-xl">
                  Personalized SAT, ACT, AP study plans designed to help you stay focused, practice smarter, and score higher with guided prep tailored to your timeline.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <button className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-7 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400" onClick={() => setSubmitted(true)}>
                  Generate My Study Plan
                </button>
                <a href="#exam-form" className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-7 py-4 text-base text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
                  Fill out the form
                </a>
              </div>
            </section>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950/90 p-6 ring-1 ring-white/10 sm:p-8">
              <div className="mb-5 rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl shadow-slate-950/30">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">Study plan preview</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Weekly focus</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  AI generates a clear weekly schedule, practice sessions, and review checkpoints so you always know what to study next.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-5 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-cyan-300">Week 1</p>
                  <p className="mt-2 text-lg font-semibold text-white">Diagnostic & skill map</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Identify strengths, gaps, and high-impact topics to prioritize.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-5 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-cyan-300">Week 2</p>
                  <p className="mt-2 text-lg font-semibold text-white">Adaptive review cycles</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Practice focused drills and revisit missed concepts with smart spacing.</p>
                </div>
              </div>
            </div>
          </div>

          <section id="exam-form" className="mt-14 rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Generate your plan</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Tell us more about your exam</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-right">
                We’ll use your exam type, score goals, and weak area to show a sample study plan instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    Exam Type
                    <select value={examType} onChange={(event) => setExamType(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400">
                      <option>SAT</option>
                      <option>ACT</option>
                      <option>AP</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    Current Score
                    <input type="number" value={currentScore} onChange={(event) => setCurrentScore(Number(event.target.value))} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" min={0} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    Target Score
                    <input type="number" value={targetScore} onChange={(event) => setTargetScore(Number(event.target.value))} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" min={0} />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    Test Date
                    <input type="date" value={testDate} onChange={(event) => setTestDate(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    Biggest Weak Area
                    <input type="text" value={weakArea} onChange={(event) => setWeakArea(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    Hours per Week
                    <input type="number" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(Number(event.target.value))} className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" min={1} />
                  </label>
                </div>

                <button type="submit" className="w-full rounded-3xl bg-cyan-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Generate My Study Plan
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-6 text-slate-300">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Instant preview</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">What to expect</h3>
                <p className="mt-3 text-sm leading-6">
                  A clean, step-by-step starter plan with progress markers, targeted review sessions, and the right practice pacing for your exam.
                </p>
                <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
                  <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Personalized timeline based on your target score and test date.</li>
                  <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Focus blocks for your biggest weakness: {weakArea}.</li>
                  <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Actionable weekly review items to boost confidence quickly.</li>
                </ul>
              </div>
            </form>

            {submitted ? (
              <div className="mt-10 rounded-[1.75rem] border border-cyan-500/20 bg-slate-950/95 p-8 shadow-xl shadow-cyan-500/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Premium study dashboard</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{samplePlan.header}</h3>
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                    Goal: {currentScore} → {targetScore}
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                    Load: {samplePlan.hoursText}
                  </div>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
                  {samplePlan.weeks.map((week) => (
                    <div key={week.title} className="rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-500/20">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">{week.title}</p>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{examType}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-white">{week.subtitle}</h4>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{week.description}</p>
                      <div className="mt-5 flex flex-col gap-3">
                        <label className="text-sm text-slate-300">
                          Status
                          <select
                            value={weekStatus[week.title]}
                            onChange={(event) => setWeekStatus((prev) => ({
                              ...prev,
                              [week.title]: event.target.value as WeekStatus,
                            }))}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                          >
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>Complete</option>
                          </select>
                        </label>
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                          <span className={`h-2.5 w-2.5 rounded-full ${weekStatus[week.title] === "Complete" ? "bg-emerald-400" : weekStatus[week.title] === "In Progress" ? "bg-cyan-300" : "bg-slate-500"}`} />
                          {weekStatus[week.title]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score predictor displayed under the plan and progress tracker */}
                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Score predictor</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Estimated progress & likelihood</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-950 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">{scorePrediction.label}</div>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-white/10">
                      <p className="text-sm text-slate-400">Estimated gain</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scorePrediction.estimatedGain ?? 0} pts</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-white/10">
                      <p className="text-sm text-slate-400">Likelihood</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scorePrediction.percentage}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/95 p-5 ring-1 ring-white/10">
                      <p className="text-sm text-slate-400">Time & load</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{hoursPerWeek} hrs/week</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-300">{scorePrediction.message}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{scorePrediction.note}</p>
                </div>
              </div>
            ) : null}
          </section>

          <section id="features" className="mt-14 rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Core exam paths</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Prep for every major test.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-right">
                Choose from SAT, ACT, or AP and get a study plan crafted for your goals, dates, and pacing preferences.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">SAT</p>
                <h3 className="mt-4 text-xl font-semibold text-white">Target reading & math mastery</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Build confidence with full-length practice, strategy guides, and score-tracking milestones.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">ACT</p>
                <h3 className="mt-4 text-xl font-semibold text-white">Fast-paced test readiness</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Optimize timing, science reasoning, and English precision with adaptive drills.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">AP Exams</p>
                <h3 className="mt-4 text-xl font-semibold text-white">Crash courses for top scores</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Set review paths, essential concept checklists, and exam-specific practice by subject.</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
