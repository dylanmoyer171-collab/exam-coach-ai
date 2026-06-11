"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AP_CATEGORIES, AP_WEAK_AREAS } from "@/lib/exam-data";
import { generateStudyPlan, type StudyPlan } from "@/lib/study-plan-generator";
import { predictAPScore, type ScorePrediction } from "@/lib/score-predictor";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function APPage() {
  const [selectedExam, setSelectedExam] = useState("");
  const [currentScore, setCurrentScore] = useState(3);
  const [targetScore, setTargetScore] = useState(5);
  const [testDate, setTestDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [studyStyle, setStudyStyle] = useState<"short_daily" | "long_weekend" | "balanced">("balanced");
  const [submitted, setSubmitted] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [prediction, setPrediction] = useState<ScorePrediction | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Get weak areas for selected exam
  const examWeakAreas = selectedExam && AP_WEAK_AREAS[selectedExam] ? AP_WEAK_AREAS[selectedExam] : [];

  const toggleWeakArea = (area: string) => {
    setWeakAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleExamChange = (examId: string) => {
    setSelectedExam(examId);
    // Reset weak areas when exam changes
    const newAreas = AP_WEAK_AREAS[examId] ? AP_WEAK_AREAS[examId].slice(0, 2) : [];
    setWeakAreas(newAreas);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!selectedExam) {
      newErrors.push("Select an AP exam");
    }
    if (!currentScore || currentScore < 1 || currentScore > 5) {
      newErrors.push("Current score must be between 1–5");
    }
    if (!targetScore || targetScore < 1 || targetScore > 5) {
      newErrors.push("Target score must be between 1–5");
    }
    if (targetScore < currentScore) {
      newErrors.push("Target score cannot be lower than current score");
    }
    if (testDate && new Date(testDate) < new Date()) {
      newErrors.push("Test date cannot be in the past");
    }
    if (hoursPerWeek <= 0) {
      newErrors.push("Study hours per week must be greater than 0");
    }
    if (weakAreas.length === 0) {
      newErrors.push("Select at least one weak area");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    const plan = generateStudyPlan(
      "AP",
      currentScore,
      targetScore,
      testDate || null,
      hoursPerWeek,
      weakAreas,
      studyStyle,
      selectedExam
    );
    const pred = predictAPScore(
      currentScore,
      targetScore,
      testDate || null,
      hoursPerWeek,
      weakAreas.length
    );

    setStudyPlan(plan);
    setPrediction(pred);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">AP</Badge>
          <h1 className="text-4xl font-bold text-white mb-2">AP Exam Study Plan Generator</h1>
          <p className="text-slate-400">
            30+ AP exams across math, sciences, humanities, languages, and arts (1–5)
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Info</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* AP Exam Selection */}
                  <div>
                    <Label htmlFor="exam">Select AP Exam</Label>
                    <Select value={selectedExam} onValueChange={handleExamChange}>
                      <SelectTrigger id="exam" className="mt-1">
                        <SelectValue placeholder="Choose an exam..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-96">
                        {AP_CATEGORIES.map((category) => (
                          <div key={category.name}>
                            <div className="px-2 py-2 text-xs font-semibold text-cyan-300">
                              {category.name}
                            </div>
                            {category.exams.map((exam) => (
                              <SelectItem key={exam.id} value={exam.id}>
                                {exam.name}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Score */}
                  <div>
                    <Label htmlFor="current">Current Score</Label>
                    <Input
                      id="current"
                      type="number"
                      min="1"
                      max="5"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-400 mt-1">1–5</p>
                  </div>

                  {/* Target Score */}
                  <div>
                    <Label htmlFor="target">Target Score</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      max="5"
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-400 mt-1">1–5</p>
                  </div>

                  {/* Test Date */}
                  <div>
                    <Label htmlFor="testDate">Test Date (Optional)</Label>
                    <Input
                      id="testDate"
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Hours Per Week */}
                  <div>
                    <Label htmlFor="hours">Study Hours / Week</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  {/* Study Style */}
                  <div>
                    <Label htmlFor="style">Study Style</Label>
                    <Select value={studyStyle} onValueChange={(v: any) => setStudyStyle(v)}>
                      <SelectTrigger id="style" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short_daily">Short Daily (1–2 hrs/day)</SelectItem>
                        <SelectItem value="long_weekend">Long Weekend (heavy Sat/Sun)</SelectItem>
                        <SelectItem value="balanced">Balanced (mixed pattern)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weak Areas */}
                  {examWeakAreas.length > 0 && (
                    <div>
                      <Label className="mb-2 block">Weak Areas</Label>
                      <div className="space-y-2">
                        {examWeakAreas.map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={weakAreas.includes(area)}
                              onChange={() => toggleWeakArea(area)}
                              className="rounded border-slate-600 bg-slate-800 text-cyan-500"
                            />
                            <span className="text-sm text-slate-300">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {errors.length > 0 && (
                    <div className="rounded-lg border border-red-500/50 bg-red-950/20 p-3">
                      {errors.map((err, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-red-300">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {err}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={!selectedExam}>
                    Generate Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {submitted && studyPlan && prediction ? (
              <div className="space-y-6">
                {/* Score Prediction */}
                <Card>
                  <CardHeader>
                    <CardTitle>Score Prediction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Likelihood</p>
                        <p className="text-3xl font-bold text-cyan-300">{prediction.likelihood}%</p>
                        <p className="text-sm text-slate-300 mt-1">{prediction.likelihood_label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Est. Gain</p>
                        <p className="text-3xl font-bold text-white">{prediction.estimatedGain}</p>
                        <p className="text-sm text-slate-300 mt-1">points</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Est. Final</p>
                        <p className="text-3xl font-bold text-white">{prediction.estimatedFinalScore}</p>
                        <p className="text-sm text-slate-300 mt-1">score</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 border-t border-slate-700 pt-4">
                      {prediction.mainReason}
                    </p>
                  </CardContent>
                </Card>

                {/* Plan Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Study Plan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300">{studyPlan.summary}</p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                      <div>
                        <p className="text-sm text-slate-400">Weeks Until Test</p>
                        <p className="text-2xl font-semibold text-white">{studyPlan.weeksUntilTest}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Total Hours</p>
                        <p className="text-2xl font-semibold text-white">
                          {studyPlan.weeksUntilTest * hoursPerWeek}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Priorities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studyPlan.priorities.map((p, idx) => (
                        <div key={idx} className="flex gap-3">
                          <Badge
                            variant={
                              p.priority === "high"
                                ? "default"
                                : p.priority === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {p.priority.toUpperCase()}
                          </Badge>
                          <div>
                            <p className="font-semibold text-white">{p.area}</p>
                            <p className="text-sm text-slate-400">{p.reason}</p>
                            <p className="text-xs text-slate-500 mt-1">{p.hoursPerWeek} hrs/week</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>4-Week Plan Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyPlan.weeks.map((week) => (
                        <div key={week.week} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                          <h4 className="font-semibold text-white mb-2">{week.week}</h4>
                          <p className="text-sm text-slate-400 mb-2">Goal: {week.goal}</p>
                          <div className="space-y-1">
                            {week.tasks.slice(0, 3).map((task, idx) => (
                              <p key={idx} className="text-sm text-slate-300">
                                • {task}
                              </p>
                            ))}
                            {week.tasks.length > 3 && (
                              <p className="text-sm text-slate-500">
                                + {week.tasks.length - 3} more tasks
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Best Step */}
                <Card className="border-cyan-500/30 bg-cyan-950/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Your Next Best Step</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white font-semibold mb-2">Start Here</p>
                    <p className="text-slate-300">{studyPlan.nextBestStep}</p>
                  </CardContent>
                </Card>
              </div>
            ) : !submitted ? (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-slate-400">Select an AP exam and fill in your information to generate a personalized study plan.</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
