"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DIAGNOSTIC_QUESTIONS, gradeDiagnostic, type DiagnosticExamType } from "@/lib/diagnostic-data";

type PracticeQuestion = {
  question: string;
  answer: string;
  explanation: string;
};

type PracticeSet = {
  category: string;
  questions: PracticeQuestion[];
};

const examTypes: DiagnosticExamType[] = ["SAT", "ACT", "AP"];

const PRACTICE_QUESTION_SETS: Record<string, PracticeQuestion[]> = {
  Algebra: [
    {
      question: "Solve for x: 5x - 7 = 18.",
      answer: "5",
      explanation: "Add 7 to both sides, then divide by 5: x = 5.",
    },
    {
      question: "If y = 2x + 3 and x = 4, what is y?",
      answer: "11",
      explanation: "Substitute x = 4 into y = 2(4) + 3 to get y = 11.",
    },
    {
      question: "Simplify: 3(2x + 1) - 4x.",
      answer: "2x + 3",
      explanation: "Distribute and combine like terms: 6x + 3 - 4x = 2x + 3.",
    },
  ],
  Reading: [
    {
      question: "What does the passage most likely mean by 'structural advantage'?",
      answer: "A built-in benefit from how something is organized.",
      explanation: "The phrase points to a benefit that comes from the organization or structure itself.",
    },
    {
      question: "If the author uses a critical tone, the most likely purpose is to:",
      answer: "Highlight flaws or concerns.",
      explanation: "A critical tone usually aims to point out problems or weaknesses.",
    },
    {
      question: "A detail in the passage is most likely included to support:",
      answer: "The main argument.",
      explanation: "Supporting details are placed to reinforce the author’s central claim.",
    },
  ],
  Grammar: [
    {
      question: "Choose the correct verb: 'Each player and coach (has/have) praised the new schedule.'",
      answer: "has",
      explanation: "With 'each' the subject is singular, so use 'has'.",
    },
    {
      question: "Select the right pronoun: 'Neither of the students brought (his/their) notebook.'",
      answer: "his",
      explanation: "In traditional grammar, 'neither' takes a singular pronoun.",
    },
    {
      question: "Which sentence is punctuated correctly?",
      answer: "The team practiced hard, and it improved quickly.",
      explanation: "The comma joins two independent clauses properly.",
    },
  ],
  "Data Analysis": [
    {
      question: "If a value jumps from 10 to 15, what is the percent increase?",
      answer: "50%",
      explanation: "The increase is 5 on 10, which is 5/10 = 0.5 or 50%.",
    },
    {
      question: "A chart shows 30 out of 50 students passed. What is the pass rate?",
      answer: "60%",
      explanation: "30 divided by 50 equals 0.6, or 60%.",
    },
    {
      question: "True or false: A higher mean always means more spread.",
      answer: "False",
      explanation: "Mean and spread measure different aspects; the mean does not determine spread.",
    },
  ],
  Timing: [
    {
      question: "If you have 35 minutes for 44 questions, what is the best pace?",
      answer: "Roughly 45 seconds per question.",
      explanation: "35 minutes divided by 44 gives just under 50 seconds per question.",
    },
    {
      question: "When a question seems very hard, the best move is to:",
      answer: "Skip it and return if time remains.",
      explanation: "Saving time for easier questions helps maintain accuracy and pace.",
    },
    {
      question: "A strong pacing plan includes:",
      answer: "Build-in review time at the end.",
      explanation: "Review time helps catch avoidable errors after the first pass.",
    },
  ],
  Pacing: [
    {
      question: "For a 60-question section in 60 minutes, the best pace is:",
      answer: "1 minute per question.",
      explanation: "That pace covers questions evenly and leaves a small buffer for review.",
    },
    {
      question: "A pacing strategy should prioritize:",
      answer: "Answering every question and marking hard ones to revisit.",
      explanation: "Every question counts, so avoid leaving easy points on the table.",
    },
    {
      question: "When time is low, you should first:",
      answer: "Finish the easier questions.",
      explanation: "Maximizing correct responses early builds confidence and points.",
    },
  ],
  General: [
    {
      question: "Review strategies include: reading the question first or after the passage?",
      answer: "Before the passage",
      explanation: "Reading the question first helps target your reading and saves time.",
    },
    {
      question: "A good study session is best when it includes:",
      answer: "Focused practice and review.",
      explanation: "Practice plus reflection builds stronger retention.",
    },
    {
      question: "When you miss a question, the best next step is to:",
      answer: "Read the explanation and redo a similar problem.",
      explanation: "Active review turns mistakes into learning moments.",
    },
  ],
};

function getPracticeQuestionsForCategory(category: string): PracticeSet {
  const exact = PRACTICE_QUESTION_SETS[category];
  if (exact) {
    return { category, questions: exact };
  }

  const normalized = category.toLowerCase();
  if (normalized.includes("algebra")) {
    return { category: "Algebra", questions: PRACTICE_QUESTION_SETS.Algebra };
  }
  if (normalized.includes("reading")) {
    return { category: "Reading", questions: PRACTICE_QUESTION_SETS.Reading };
  }
  if (normalized.includes("grammar") || normalized.includes("english")) {
    return { category: "Grammar", questions: PRACTICE_QUESTION_SETS.Grammar };
  }
  if (normalized.includes("data") || normalized.includes("statistics")) {
    return { category: "Data Analysis", questions: PRACTICE_QUESTION_SETS["Data Analysis"] };
  }
  if (normalized.includes("timing") || normalized.includes("pacing")) {
    return { category: "Timing", questions: PRACTICE_QUESTION_SETS.Timing };
  }

  return { category: "General review", questions: PRACTICE_QUESTION_SETS.General };
}

function buildResultText(examType: DiagnosticExamType, result: ReturnType<typeof gradeDiagnostic>) {
  const strengths = result.strengths.length ? result.strengths.join(", ") : "None";
  const weakAreas = result.weakAreas.length ? result.weakAreas.join(", ") : "None";
  const missed = result.missedQuestions
    .map((question) => `- ${question.category}: correct answer ${question.answer}. ${question.explanation}`)
    .join("\n");
  const planText = result.plan
    .map((day) => `${day.day}: ${day.focus}\n${day.tasks.map((task) => `  • ${task}`).join("\n")}`)
    .join("\n\n");

  return [
    `Exam: ${examType}`,
    `Score: ${result.correctCount} / ${result.total}`,
    `Level: ${result.levelLabel}`,
    `Note: ${result.levelNote}`,
    `Strengths: ${strengths}`,
    `Weak areas: ${weakAreas}`,
    "",
    "Missed question explanations:",
    missed || "None",
    "",
    "7-day study plan:",
    planText,
  ].join("\n");
}

export default function DiagnosticPage() {
  const [examType, setExamType] = useState<DiagnosticExamType>("SAT");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof gradeDiagnostic> | null>(null);
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);

  const questions = useMemo(() => DIAGNOSTIC_QUESTIONS[examType], [examType]);

  const handleAnswer = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(gradeDiagnostic(examType, selectedAnswers));
  };

  const handleCopyStudyPlan = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(buildResultText(examType, result));
  };

  const handleDownloadResults = () => {
    if (!result) return;

    const text = buildResultText(examType, result);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagnostic-results.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRetakeDiagnostic = () => {
    setSelectedAnswers({});
    setResult(null);
    setPracticeSet(null);
  };

  const handlePracticeWeakAreas = () => {
    if (!result) return;
    const category = result.weakAreas[0] || result.strengths[0] || "General";
    setPracticeSet(getPracticeQuestionsForCategory(category));
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
