"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DIAGNOSTIC_QUESTIONS, gradeDiagnostic, type DiagnosticExamType } from "@/lib/diagnostic-data";

const examTypes: DiagnosticExamType[] = ["SAT", "ACT", "AP"];

export default function DiagnosticPage() {
  const [examType, setExamType] = useState<DiagnosticExamType>("SAT");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof gradeDiagnostic> | null>(null);

  const questions = useMemo(() => DIAGNOSTIC_QUESTIONS[examType], [examType]);

  const handleAnswer = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(gradeDiagnostic(examType, selectedAnswers));
  };

  const isReadyToSubmit = questions.every((question) => selectedAnswers[question.id]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-cyan-500/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3">Free Diagnostic</Badge>
              <h1 className="text-4xl font-bold text-white">Take a quick 5-question exam check.</h1>
              <p className="mt-3 max-w-2xl text-slate-300 sm:text-lg">
                Choose SAT, ACT, or AP and answer short sample questions. Get instant coaching feedback with weak areas, strengths, explanations, and a simple 1-week study plan.
              </p>
            </div>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.95fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {examTypes.map((type) => (
                <Button
                  key={type}
                  variant={examType === type ? "default" : "outline"}
                  onClick={() => {
                    setExamType(type);
                    setSelectedAnswers({});
                    setResult(null);
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>

            <Card className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6">
              <CardHeader className="p-0">
                <CardTitle>{examType} Sample Questions</CardTitle>
                <CardDescription>Answer all 5 questions to unlock your quick diagnostic report.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <CardHeader className="p-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Question {index + 1}</p>
                          <CardTitle className="mt-2 text-lg text-white">{question.category}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-slate-300">{question.exam}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      <p className="text-slate-200 whitespace-pre-line">{question.question}</p>
                      <div className="mt-4 grid gap-3">
                        {question.choices.map((choice) => (
                          <label
                            key={choice}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 transition hover:border-cyan-500/40"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={choice}
                              checked={selectedAnswers[question.id] === choice}
                              onChange={() => handleAnswer(question.id, choice)}
                              className="h-4 w-4 accent-cyan-400"
                            />
                            <span className="text-slate-200">{choice}</span>
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    {isReadyToSubmit ? "Ready to grade your diagnostic." : "Select one answer for each question."}
                  </p>
                  <Button type="submit" disabled={!isReadyToSubmit} className="w-full sm:w-auto">
                    Grade My Diagnostic
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6">
              <CardHeader className="p-0">
                <CardTitle>Why this diagnostic matters</CardTitle>
                <CardDescription>Instant coaching insights to jumpstart your study plan.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Benefits</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li>• Find the exact topics you missed.</li>
                    <li>• Get a confidence level from your score.</li>
                    <li>• See recommended next-step practice.</li>
                    <li>• Start a one-week study plan immediately.</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Next step</p>
                  <p className="mt-3 text-slate-300">
                    After grading, use your results to focus on the areas that move your score the most. Come back and retake the diagnostic when you're ready.
                  </p>
                </div>
              </CardContent>
            </Card>

            {result ? (
              <Card className="rounded-[2rem] border border-cyan-500/20 bg-slate-900/90 p-6">
                <CardHeader className="p-0">
                  <CardTitle>Coach Report</CardTitle>
                  <CardDescription>Your instant performance summary</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm text-slate-400">Score</p>
                      <p className="mt-2 text-3xl font-bold text-white">{result.correctCount} / {result.total}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm text-slate-400">Level</p>
                      <p className="mt-2 text-2xl font-bold text-white">{result.levelLabel}</p>
                      <p className="mt-2 text-sm text-slate-400">{result.levelNote}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Strengths</p>
                      {result.strengths.length ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                          {result.strengths.map((strength) => (
                            <li key={strength}>{strength}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-slate-400">No answers were fully strong yet.</p>
                      )}
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Weak areas</p>
                      {result.weakAreas.length ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-300">
                          {result.weakAreas.map((weakArea) => (
                            <li key={weakArea}>{weakArea}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-slate-400">No weak areas to report.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Coach recommendations</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">7-day plan</p>
                    <div className="mt-3 space-y-3 text-sm text-slate-300">
                      {result.plan.map((day) => (
                        <div key={day.day} className="space-y-2 rounded-2xl bg-slate-900/80 p-3">
                          <p className="font-semibold text-white">{day.day}: {day.focus}</p>
                          <ul className="list-disc space-y-1 pl-5 text-slate-300">
                            {day.tasks.map((task) => (
                              <li key={task}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.missedQuestions.length > 0 && (
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Missed question explanations</p>
                      <div className="mt-3 space-y-4 text-sm text-slate-300">
                        {result.missedQuestions.map((question) => (
                          <div key={question.id} className="rounded-2xl bg-slate-900/80 p-4">
                            <p className="font-semibold text-white">{question.category}</p>
                            <p className="mt-2 text-slate-300">Correct answer: {question.answer}</p>
                            <p className="mt-1 text-slate-400">{question.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
