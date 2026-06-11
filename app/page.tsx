"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const header = `${examType === "AP" ? "AP" : examType} plan for ${testDate ? `test on ${testDate}` : "your target date"}`;
    const hoursText = `${hoursPerWeek} hrs/week`;

    if (examType === "ACT") {
      const isScience = weakArea.toLowerCase().includes("science");
      const isReading = weakArea.toLowerCase().includes("reading");
      const isMath = weakArea.toLowerCase().includes("math");
      const isEnglish = weakArea.toLowerCase().includes("english");

      return {
        header,
        hoursText,
        weeks: [
          {
            title: "Week 1",
            subtitle: "Diagnostic & weak area mapping",
            description: `Take a full-length ACT diagnostic. Analyze your ${weakArea} performance in detail. Allocate ${hoursPerWeek * 0.4}h to review patterns and ${hoursPerWeek * 0.6}h to foundational skill drills in your weak area.`,
          },
          {
            title: "Week 2",
            subtitle: isMath ? "ACT math strategies" : isEnglish ? "English grammar & punctuation" : isScience ? "Science reasoning practice" : "Reading comprehension tactics",
            description: isMath
              ? `Master ${weakArea} concepts (algebra, geometry, trigonometry). Use ${hoursPerWeek * 0.5}h on Khan Academy or official ACT prep for these topics, ${hoursPerWeek * 0.5}h on timed problem sets.`
              : isEnglish
              ? `Drill grammar rules, comma splices, and parallel structure. Spend ${hoursPerWeek * 0.6}h on targeted exercises and ${hoursPerWeek * 0.4}h on passage-based practice.`
              : isScience
              ? `Practice interpret graphs and data-driven questions. ${hoursPerWeek * 0.5}h on data representation, ${hoursPerWeek * 0.5}h on research summaries.`
              : `Build speed and accuracy on dense passages. ${hoursPerWeek * 0.5}h untimed comprehension, ${hoursPerWeek * 0.5}h timed practice under test conditions.`,
          },
          {
            title: "Week 3",
            subtitle: "Full section & integrated practice",
            description: `Take two full-length ACT practice tests (full 3h 35m). Review every missed question, categorizing by error type (careless, concept, pacing). Dedicate remaining ${hoursPerWeek - 7}h to drilling the specific error categories.`,
          },
          {
            title: "Week 4",
            subtitle: "Final review & test-day readiness",
            description: `Complete one more full-length under test conditions. Review weak patterns one more time. Spend ${hoursPerWeek * 0.5}h polishing pacing on ${weakArea}, ${hoursPerWeek * 0.5}h on confidence-building with easy-to-medium problem sets.`,
          },
        ],
      };
    }

    if (examType === "AP") {
      const isCalculus = weakArea.toLowerCase().includes("calculus") || weakArea.toLowerCase().includes("calc");
      const isPhysics = weakArea.toLowerCase().includes("physics");
      const isChemistry = weakArea.toLowerCase().includes("chemistry") || weakArea.toLowerCase().includes("chem");

      if (isCalculus) {
        return {
          header: `AP Calculus plan for ${testDate ? `test on ${testDate}` : "your target date"}`,
          hoursText,
          weeks: [
            {
              title: "Week 1",
              subtitle: "Limits, derivatives & fundamentals",
              description: `Master limits and derivative rules (power, product, quotient, chain). Spend ${hoursPerWeek * 0.4}h on limit laws and conceptual understanding, ${hoursPerWeek * 0.6}h on computational drills of basic derivatives.`,
            },
            {
              title: "Week 2",
              subtitle: "Applications & FRQ practice",
              description: `Focus on applied derivatives (optimization, related rates, L'Hôpital's rule). Dedicate ${hoursPerWeek * 0.5}h to understanding problem setup and ${hoursPerWeek * 0.5}h to AP-style free-response practice with detailed justification.`,
            },
            {
              title: "Week 3",
              subtitle: "Integration & area problems",
              description: `Master integration techniques, Riemann sums, and applications. Allocate ${hoursPerWeek * 0.6}h to integration drills (substitution, by parts) and ${hoursPerWeek * 0.4}h to area and volume problems with multiple-choice practice.`,
            },
            {
              title: "Week 4",
              subtitle: "Full-length practice & final polish",
              description: `Complete two full-length AP Calculus exams (105 min MC + 90 min FRQ). Review all errors carefully. Spend ${hoursPerWeek * 0.5}h on error analysis and ${hoursPerWeek * 0.5}h on confidence-building with supplementary problem sets in ${weakArea}.`,
            },
          ],
        };
      }

      if (isPhysics) {
        return {
          header: `AP Physics plan for ${testDate ? `test on ${testDate}` : "your target date"}`,
          hoursText,
          weeks: [
            {
              title: "Week 1",
              subtitle: "Kinematics & forces fundamentals",
              description: `Master motion equations and Newton's laws. Spend ${hoursPerWeek * 0.4}h on conceptual understanding with free-body diagrams and ${hoursPerWeek * 0.6}h on computational practice (equations of motion, force analysis).`,
            },
            {
              title: "Week 2",
              subtitle: "Work, energy & impulse",
              description: `Learn energy conservation and momentum principles. Dedicate ${hoursPerWeek * 0.5}h to connecting concepts (KE, PE, work-energy theorem) and ${hoursPerWeek * 0.5}h to problems requiring multi-step analysis.`,
            },
            {
              title: "Week 3",
              subtitle: "Circuits, waves & oscillations",
              description: `Master circuit analysis, standing waves, and simple harmonic motion. Allocate ${hoursPerWeek * 0.6}h to lab-based scenarios and data interpretation, ${hoursPerWeek * 0.4}h to conceptual multiple-choice practice on less familiar topics.`,
            },
            {
              title: "Week 4",
              subtitle: "Full-length exams & FRQ mastery",
              description: `Complete two full AP Physics exams (90 min MC + 90 min FRQ). Analyze common FRQ scoring patterns. Spend ${hoursPerWeek * 0.5}h on targeted FRQ practice and explanations, ${hoursPerWeek * 0.5}h on weak-topic reinforcement with problem sets.`,
            },
          ],
        };
      }

      if (isChemistry) {
        return {
          header: `AP Chemistry plan for ${testDate ? `test on ${testDate}` : "your target date"}`,
          hoursText,
          weeks: [
            {
              title: "Week 1",
              subtitle: "Stoichiometry & atomic structure",
              description: `Strengthen foundational chemistry: moles, limiting reactants, and atomic models. Spend ${hoursPerWeek * 0.4}h on conceptual videos (Crash Course or Khan Academy) and ${hoursPerWeek * 0.6}h on calculation-heavy problem sets.`,
            },
            {
              title: "Week 2",
              subtitle: "Equilibrium & thermodynamics",
              description: `Master equilibrium constants, Le Chatelier's principle, and thermochemistry. Dedicate ${hoursPerWeek * 0.5}h to equilibrium problem-solving and ${hoursPerWeek * 0.5}h to understanding enthalpy and entropy applications.`,
            },
            {
              title: "Week 3",
              subtitle: "Acid-base & redox reactions",
              description: `Learn pH, buffers, and electron transfer. Allocate ${hoursPerWeek * 0.6}h to balancing redox equations and pH calculations, ${hoursPerWeek * 0.4}h to interpreting titration curves and lab data interpretation.`,
            },
            {
              title: "Week 4",
              subtitle: "Full-length exams & synthesis",
              description: `Complete two full AP Chemistry exams (90 min MC + 105 min FRQ including lab-based questions). Review FRQ rubrics and common scoring pitfalls. Spend ${hoursPerWeek * 0.5}h on thorough FRQ practice and ${hoursPerWeek * 0.5}h on reinforcing ${weakArea} with targeted problem sets.`,
            },
          ],
        };
      }

      // Generic AP fallback
      return {
        header,
        hoursText,
        weeks: [
          {
            title: "Week 1",
            subtitle: "Diagnostic & concept inventory",
            description: `Assess your understanding of major unit topics. Spend ${hoursPerWeek * 0.4}h identifying knowledge gaps in ${weakArea}. Allocate ${hoursPerWeek * 0.6}h to reviewing the most critical foundational concepts and definitions.`,
          },
          {
            title: "Week 2",
            subtitle: "Active recall & problem-solving",
            description: `Focus on ${weakArea} using Cornell notes and spaced repetition. Dedicate ${hoursPerWeek * 0.6}h to practice problems and FRQs, ${hoursPerWeek * 0.4}h to reviewing solutions and understanding mistake patterns.`,
          },
          {
            title: "Week 3",
            subtitle: "Multiple-choice & timing practice",
            description: `Complete full-length practice tests under timed conditions. Review all missed questions. Allocate ${hoursPerWeek * 0.7}h to practice tests and ${hoursPerWeek * 0.3}h to targeted review of recurring weak topics.`,
          },
          {
            title: "Week 4",
            subtitle: "Final review sprint & test prep",
            description: `Do one final practice test and comprehensive review. Spend ${hoursPerWeek * 0.5}h on FRQ practice and scoring rubrics. Use remaining ${hoursPerWeek * 0.5}h to boost confidence on ${weakArea} with easier problem sets and key fact review.`,
          },
        ],
      };
    }

    // SAT Plan
    const isReadingWriting = weakArea.toLowerCase().includes("reading") || weakArea.toLowerCase().includes("writing") || weakArea.toLowerCase().includes("english");
    const isMathSAT = weakArea.toLowerCase().includes("math") || weakArea.toLowerCase().includes("algebra") || weakArea.toLowerCase().includes("geometry");

    return {
      header,
      hoursText,
      weeks: [
        {
          title: "Week 1",
          subtitle: "Diagnostic & skill mapping",
          description: `Take a full SAT diagnostic. Analyze score breakdown by section. Spend ${hoursPerWeek * 0.4}h identifying patterns in ${weakArea} errors and ${hoursPerWeek * 0.6}h on foundational skill reviews (Khan Academy is ideal for this).`,
        },
        {
          title: "Week 2",
          subtitle: isReadingWriting ? "Reading & writing precision" : "Math mastery drills",
          description: isReadingWriting
            ? `Master vocabulary, grammar rules, and passage comprehension. Dedicate ${hoursPerWeek * 0.5}h to targeted lessons, ${hoursPerWeek * 0.5}h to untimed practice problems until mastery is clear.`
            : `Build deep understanding of algebra, advanced math, and problem-solving. Use ${hoursPerWeek * 0.5}h for concept reviews and ${hoursPerWeek * 0.5}h for worked problem sets targeting ${weakArea}.`,
        },
        {
          title: "Week 3",
          subtitle: "Timed section practice & pacing",
          description: `Complete two full-length SAT practice tests under real test conditions. Analyze timing and accuracy for each section. Spend ${hoursPerWeek * 0.6}h on timed tests and ${hoursPerWeek * 0.4}h analyzing all mistakes by category.`,
        },
        {
          title: "Week 4",
          subtitle: "Weak-area intensive & confidence build",
          description: `Do one final full-length SAT. Review all errors in depth. Allocate ${hoursPerWeek * 0.5}h to drilling ${weakArea} with targeted problem sets, ${hoursPerWeek * 0.5}h to review and final confidence-building on your strongest skills.`,
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
                <Button size="lg" onClick={() => setSubmitted(true)}>
                  Generate My Study Plan
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById("exam-form")?.scrollIntoView({ behavior: "smooth" })}>
                  Fill out the form
                </Button>
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
              <Card className="space-y-5">
                <CardHeader>
                  <CardTitle className="text-2xl">Your preferences</CardTitle>
                  <CardDescription>Customize your study plan to match your goals and timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="exam-type">Exam Type</Label>
                      <Select value={examType} onValueChange={setExamType}>
                        <SelectTrigger id="exam-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAT">SAT</SelectItem>
                          <SelectItem value="ACT">ACT</SelectItem>
                          <SelectItem value="AP">AP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-score">Current Score</Label>
                      <Input id="current-score" type="number" value={currentScore} onChange={(event) => setCurrentScore(Number(event.target.value))} min={0} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target-score">Target Score</Label>
                      <Input id="target-score" type="number" value={targetScore} onChange={(event) => setTargetScore(Number(event.target.value))} min={0} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-date">Test Date</Label>
                      <Input id="test-date" type="date" value={testDate} onChange={(event) => setTestDate(event.target.value)} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weak-area">Biggest Weak Area</Label>
                      <Input id="weak-area" type="text" value={weakArea} onChange={(event) => setWeakArea(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours-per-week">Hours per Week</Label>
                      <Input id="hours-per-week" type="number" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(Number(event.target.value))} min={1} />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Generate My Study Plan
                  </Button>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Instant preview</p>
                  <CardTitle>What to expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-6">
                    A clean, step-by-step starter plan with progress markers, targeted review sessions, and the right practice pacing for your exam.
                  </p>
                  <ul className="space-y-3 text-sm leading-6 text-slate-300">
                    <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Personalized timeline based on your target score and test date.</li>
                    <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Focus blocks for your biggest weakness: {weakArea}.</li>
                    <li className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/10">Actionable weekly review items to boost confidence quickly.</li>
                  </ul>
                </CardContent>
              </Card>
            </form>

            {submitted ? (
              <Card className="mt-10 border-cyan-500/20">
                <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-transparent">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Premium study dashboard</p>
                      <CardTitle className="mt-2">{samplePlan.header}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Goal: {currentScore} → {targetScore}</Badge>
                      <Badge variant="secondary">Load: {samplePlan.hoursText}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">

                <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
                  {samplePlan.weeks.map((week) => (
                    <Card key={week.title} className="transition hover:-translate-y-1 hover:border-cyan-500/20">
                      <CardHeader className="pb-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">{week.title}</p>
                          <Badge variant="secondary">{examType}</Badge>
                        </div>
                        <CardTitle className="text-xl">{week.subtitle}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-6 text-slate-400">{week.description}</p>
                        <div className="space-y-3">
                          <Label htmlFor={`status-${week.title}`} className="text-sm">
                            Status
                          </Label>
                          <Select value={weekStatus[week.title]} onValueChange={(value) => setWeekStatus((prev) => ({
                            ...prev,
                            [week.title]: value as WeekStatus,
                          }))}>
                            <SelectTrigger id={`status-${week.title}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Started">Not Started</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant={
                            weekStatus[week.title] === "Complete" 
                              ? "status_complete" 
                              : weekStatus[week.title] === "In Progress" 
                              ? "status_inprogress" 
                              : "status_notstarted"
                          } className="mt-2 w-fit">
                            {weekStatus[week.title]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Score predictor displayed under the plan and progress tracker */}
                <Card className="mt-8 border-white/10">
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Score predictor</p>
                        <CardTitle className="mt-2">Estimated progress & likelihood</CardTitle>
                      </div>
                      <Badge variant="secondary">{scorePrediction.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Card className="bg-slate-950/95">
                        <CardContent className="p-5">
                          <p className="text-sm text-slate-400">Estimated gain</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{scorePrediction.estimatedGain ?? 0} pts</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-950/95">
                        <CardContent className="p-5">
                          <p className="text-sm text-slate-400">Likelihood</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{scorePrediction.percentage}%</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-950/95">
                        <CardContent className="p-5">
                          <p className="text-sm text-slate-400">Time & load</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{hoursPerWeek} hrs/week</p>
                        </CardContent>
                      </Card>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{scorePrediction.message}</p>
                    <p className="text-sm leading-6 text-slate-400">{scorePrediction.note}</p>
                  </CardContent>
                </Card>
                </CardContent>
              </Card>
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
              <Card className="transition hover:-translate-y-1 hover:border-cyan-500/20">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">SAT</Badge>
                  <CardTitle className="mt-4">Target reading & math mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-400">Build confidence with full-length practice, strategy guides, and score-tracking milestones.</p>
                </CardContent>
              </Card>
              <Card className="transition hover:-translate-y-1 hover:border-cyan-500/20">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">ACT</Badge>
                  <CardTitle className="mt-4">Fast-paced test readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-400">Optimize timing, science reasoning, and English precision with adaptive drills.</p>
                </CardContent>
              </Card>
              <Card className="transition hover:-translate-y-1 hover:border-cyan-500/20">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">AP Exams</Badge>
                  <CardTitle className="mt-4">Crash courses for top scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-400">Set review paths, essential concept checklists, and exam-specific practice by subject.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
