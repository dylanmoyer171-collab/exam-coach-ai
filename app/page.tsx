"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, BarChart3, ArrowRight, Copy, Download, RefreshCcw, Sparkles } from "lucide-react";

const SAMPLE_STUDY_PLAN = [
  "Day 1: Algebra concept review",
  "Day 2: Timed practice set",
  "Day 3: Reading strategy drills",
];

export default function Home() {
  const copyStudyPlan = async () => {
    const plan = `Diagnostic Study Plan:\n${SAMPLE_STUDY_PLAN.join("\n")}`;
    try {
      await navigator.clipboard.writeText(plan);
      alert("Study plan copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy plan:", err);
    }
  };

  const downloadResults = () => {
    const data = `SAT Coach Diagnostic Results
Score: 4 / 5 correct
Level: Developing
Weak Areas: Algebra, Timing
Strengths: Reading, Grammar`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagnostic-results.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-8 sm:py-32">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl space-y-8 text-center">
          <Badge variant="secondary" className="mx-auto">
            Free Test Prep Planning
          </Badge>
          
          <h1 className="text-5xl font-bold sm:text-7xl text-white">
            Build a smarter study plan for your next big exam.
          </h1>
          
          <p className="text-xl text-slate-300 sm:text-2xl">
            Create personalized SAT, ACT, and AP study plans based on your score, test date, weak areas, and available study time.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/diagnostic">Start Free Diagnostic</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#exams">Explore Exams</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Diagnostic Snapshot Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 ring-1 ring-cyan-500/20">
              Free Diagnostic
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Quick check. Instant test prep direction.</h2>
            <p className="text-lg text-slate-300 mb-6">
              Take a five-question diagnostic for SAT, ACT, or AP and get a fast coach-style report with your strengths, weak areas, estimated level, and a one-week action plan.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Weak areas", desc: "See the exact topics holding your score back." },
                { title: "Strengths", desc: "Know what you can build on immediately." },
                { title: "Score estimate", desc: "Get a level estimate without a full test." },
                { title: "Next week plan", desc: "Start studying with a simple one-week schedule." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-cyan-500/20 bg-slate-900/80">
            <CardHeader>
              <Badge variant="secondary" className="mb-2">Sample Result</Badge>
              <CardTitle>Diagnostic Coach Report</CardTitle>
              <CardDescription>Instant feedback from a quick sample check.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Score</p>
                <p className="text-3xl font-bold text-white">4 / 5 correct</p>
                <p className="text-sm text-slate-400">Level: Developing</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Weak areas</p>
                  <p className="mt-2 font-semibold text-white">Algebra, Timing</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Strengths</p>
                  <p className="mt-2 font-semibold text-white">Reading, Grammar</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Next week plan</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {SAMPLE_STUDY_PLAN.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline" size="sm" onClick={copyStudyPlan} className="text-xs h-9">
                  <Copy className="mr-2 h-3.5 w-3.5" /> Copy Plan
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResults} className="text-xs h-9">
                  <Download className="mr-2 h-3.5 w-3.5" /> Download
                </Button>
                <Button variant="outline" size="sm" asChild className="text-xs h-9">
                  <Link href="/diagnostic">
                    <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Retake
                  </Link>
                </Button>
                <Button size="sm" asChild className="text-xs h-9 bg-cyan-600 hover:bg-cyan-500 border-none">
                  <Link href="/practice">
                    <Sparkles className="mr-2 h-3.5 w-3.5" /> Practice
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Exam Cards Section */}
      <section id="exams" className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Exam</h2>
          <p className="text-lg text-slate-400">Get a study plan tailored to your specific test.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* SAT Card */}
          <Card className="transition hover:border-cyan-500/40 hover:-translate-y-1">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">SAT</Badge>
              <CardTitle className="mt-4">SAT Test Planner</CardTitle>
              <CardDescription>Evidence-Based Reading & Writing + Math</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Score Range:</p>
                <p className="font-semibold text-white">400–1600 (200–800 per section)</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sat">Start SAT Plan</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ACT Card */}
          <Card className="transition hover:border-cyan-500/40 hover:-translate-y-1">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">ACT</Badge>
              <CardTitle className="mt-4">ACT Test Planner</CardTitle>
              <CardDescription>English, Math, Reading, Science + Writing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Score Range:</p>
                <p className="font-semibold text-white">1–36 (Composite)</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/act">Start ACT Plan</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AP Card */}
          <Card className="transition hover:border-cyan-500/40 hover:-translate-y-1">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">AP</Badge>
              <CardTitle className="mt-4">AP Exam Planner</CardTitle>
              <CardDescription>30+ AP subjects across all disciplines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Score Range:</p>
                <p className="font-semibold text-white">1–5 (Per exam)</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/ap">Start AP Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">How It Works</h2>
        
        <div className="grid gap-8 md:grid-cols-5">
          {[
            { num: "1", title: "Choose Your Exam", desc: "Select SAT, ACT, or a specific AP exam." },
            { num: "2", title: "Enter Your Goals", desc: "Input your current score and target." },
            { num: "3", title: "Identify Weak Areas", desc: "Pick the topics you struggle with most." },
            { num: "4", title: "Get Your Plan", desc: "Receive a personalized 4-week study plan." },
            { num: "5", title: "Track Progress", desc: "Monitor your improvement along the way." },
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 ring-1 ring-cyan-500/40">
                <span className="text-lg font-bold text-cyan-300">{step.num}</span>
              </div>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
              {idx < 4 && (
                <div className="absolute -right-4 top-6 hidden text-slate-700 md:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-900/50 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Why Students Waste Time Studying
          </h2>
          
          <div className="space-y-4">
            {[
              { icon: "❌", title: "Random studying", desc: "No clear plan or prioritization—hours wasted on easy topics instead of weak areas." },
              { icon: "❌", title: "Ignoring the test date", desc: "Not adjusting study intensity to how much time you actually have left." },
              { icon: "❌", title: "Over-focusing on strengths", desc: "Practicing what you're already good at instead of addressing gaps." },
              { icon: "❌", title: "No progress tracking", desc: "Can't tell if your study methods are actually working." },
              { icon: "❌", title: "Skipping weak areas", desc: "Avoiding tough topics instead of breaking them down systematically." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 rounded-lg border border-white/10 bg-slate-950/50 p-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Tool Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">
          Our Tool Fixes These Problems
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: BarChart3, title: "Smart Prioritization", desc: "We calculate which topics give you the highest score improvement potential." },
            { icon: CheckCircle2, title: "Real-Time Tracking", desc: "Mark tasks complete as you go and watch your progress accumulate." },
            { icon: BookOpen, title: "Realistic Expectations", desc: "Score predictor shows what's achievable based on your time and effort." },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                  <Icon className="h-6 w-6 text-cyan-300" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-8 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Start your free diagnostic today.
        </h2>
        <p className="mb-8 text-xl text-slate-400">
          Take a fast 5-question check and get a personalized study direction instantly.
        </p>
        <Button size="lg" asChild>
          <Link href="/diagnostic">Start Free Diagnostic</Link>
        </Button>
      </section>
    </div>
  );
}
