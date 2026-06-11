"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAT_CONFIG, ACT_CONFIG, AP_CATEGORIES, AP_WEAK_AREAS } from "@/lib/exam-data";
import { generateStudyPlan, type StudyPlan } from "@/lib/study-plan-generator";
import { predictSATScore, predictACTScore, predictAPScore, type ScorePrediction } from "@/lib/score-predictor";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

type ExamType = "SAT" | "ACT" | "AP";

export default function StudyPlanGenerator() {
  const [examType, setExamType] = useState<ExamType>("SAT");
  const [selectedAPExam, setSelectedAPExam] = useState("");
  const [currentScore, setCurrentScore] = useState(850);
  const [targetScore, setTargetScore] = useState(1200);
  const [testDate, setTestDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [weakAreas, setWeakAreas] = useState<string[]>(["Problem Solving", "Advanced Math"]);
  const [studyStyle, setStudyStyle] = useState<"short_daily" | "long_weekend" | "balanced">("balanced");
  const [submitted, setSubmitted] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [prediction, setPrediction] = useState<ScorePrediction | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [progressChecklist, setProgressChecklist] = useState<Record<string, boolean>>({});

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studyProgress");
    if (saved) {
      try {
        setProgressChecklist(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("studyProgress", JSON.stringify(progressChecklist));
  }, [progressChecklist]);

  const getCurrentWeakAreas = () => {
    if (examType === "SAT") return SAT_CONFIG.weakAreas;
    if (examType === "ACT") return ACT_CONFIG.weakAreas;
    if (examType === "AP" && selectedAPExam) return AP_WEAK_AREAS[selectedAPExam] || [];
    return [];
  };

  const toggleWeakArea = (area: string) => {
    setWeakAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleProgressItem = (key: string) => {
    setProgressChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExamTypeChange = (type: ExamType) => {
    setExamType(type);
    setSelectedAPExam("");
    if (type === "SAT") {
      setCurrentScore(850);
      setTargetScore(1200);
      setWeakAreas(["Problem Solving", "Advanced Math"]);
    } else if (type === "ACT") {
      setCurrentScore(25);
      setTargetScore(32);
      setWeakAreas(["Science Reasoning", "Math Algebra"]);
    }
    setSubmitted(false);
  };

  const handleAPExamChange = (examId: string) => {
    setSelectedAPExam(examId);
    const newAreas = AP_WEAK_AREAS[examId] ? AP_WEAK_AREAS[examId].slice(0, 2) : [];
    setWeakAreas(newAreas);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (examType === "AP" && !selectedAPExam) {
      newErrors.push("Select an AP exam");
    }

    const isValidScore = (score: number, max: number) => !isNaN(score) && score >= 1 && score <= max;
    const maxScore = examType === "SAT" ? 1600 : 36;
    const minScore = examType === "SAT" ? 400 : 1;

    if (examType === "SAT") {
      if (!isValidScore(currentScore, 1600)) newErrors.push("Current score must be 400–1600");
      if (!isValidScore(targetScore, 1600)) newErrors.push("Target score must be 400–1600");
    } else {
      if (!isValidScore(currentScore, 36)) newErrors.push("Current score must be 1–36");
      if (!isValidScore(targetScore, 36)) newErrors.push("Target score must be 1–36");
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
      examType,
      currentScore,
      targetScore,
      testDate || null,
      hoursPerWeek,
      weakAreas,
      studyStyle,
      examType === "AP" ? selectedAPExam : undefined
    );

    let pred: ScorePrediction;
    if (examType === "SAT") {
      pred = predictSATScore(
        currentScore,
        targetScore,
        testDate || null,
        hoursPerWeek,
        weakAreas.length
      );
    } else if (examType === "ACT") {
      pred = predictACTScore(
        currentScore,
        targetScore,
        testDate || null,
        hoursPerWeek,
        weakAreas.length
      );
    } else {
      pred = predictAPScore(
        currentScore,
        targetScore,
        testDate || null,
        hoursPerWeek,
        weakAreas.length
      );
    }

    setStudyPlan(plan);
    setPrediction(pred);
    setSubmitted(true);
    setProgressChecklist({});
  };

  const availableWeakAreas = getCurrentWeakAreas();
  const showAPExamSelect = examType === "AP";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Study Plan Generator</h1>
          <p className="text-slate-400 mb-6">
            Create a personalized study plan for SAT, ACT, or AP exams in under 2 minutes.
          </p>

          {/* Exam Type Selector */}
          <div className="flex flex-wrap gap-3">
            {(["SAT", "ACT", "AP"] as const).map((type) => (
              <Button
                key={type}
                variant={examType === type ? "default" : "outline"}
                onClick={() => handleExamTypeChange(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{examType} Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* AP Exam Selection */}
                  {showAPExamSelect && (
                    <div>
                      <Label htmlFor="ap-exam">AP Exam</Label>
                      <Select value={selectedAPExam} onValueChange={handleAPExamChange}>
                        <SelectTrigger id="ap-exam" className="mt-1">
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
                  )}

                  {/* Current Score */}
                  <div>
                    <Label htmlFor="current">
                      Current Score ({examType === "SAT" ? "400–1600" : examType === "ACT" ? "1–36" : "1–5"})
                    </Label>
                    <Input
                      id="current"
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  {/* Target Score */}
                  <div>
                    <Label htmlFor="target">
                      Target Score ({examType === "SAT" ? "400–1600" : examType === "ACT" ? "1–36" : "1–5"})
                    </Label>
                    <Input
                      id="target"
                      type="number"
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      className="mt-1"
                    />
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
                  {availableWeakAreas.length > 0 && (
                    <div>
                      <Label className="mb-2 block">Weak Areas</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableWeakAreas.map((area) => (
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
                    <div className="rounded-lg border border-red-500/50 bg-red-950/20 p-3 space-y-2">
                      {errors.map((err, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-red-300">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {err}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Generate Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {submitted && studyPlan && prediction ? (
              <>
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
                    {prediction.warning && (
                      <p className="text-sm text-yellow-300 pt-4 border-t border-slate-700">
                        ⚠️ {prediction.warning}
                      </p>
                    )}
                    {prediction.encouragement && (
                      <p className="text-sm text-green-300 pt-4 border-t border-slate-700">
                        ✓ {prediction.encouragement}
                      </p>
                    )}
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
                          <div className="flex-1">
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
                      {studyPlan.weeks.map((week, weekIdx) => (
                        <div key={week.week} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                          <h4 className="font-semibold text-white mb-2">{week.week}</h4>
                          <p className="text-sm text-slate-400 mb-3">Goal: {week.goal}</p>
                          <div className="space-y-2">
                            {week.tasks.map((task, taskIdx) => {
                              const taskKey = `week-${weekIdx}-task-${taskIdx}`;
                              const isComplete = progressChecklist[taskKey];
                              return (
                                <label
                                  key={taskKey}
                                  className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-slate-800/50 transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isComplete || false}
                                    onChange={() => toggleProgressItem(taskKey)}
                                    className="rounded border-slate-600 bg-slate-800 text-cyan-500 mt-1"
                                  />
                                  <span className={`text-sm ${isComplete ? "text-slate-500 line-through" : "text-slate-300"}`}>
                                    {task}
                                  </span>
                                </label>
                              );
                            })}
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

                {/* Daily Schedule Example */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Daily Schedule ({studyStyle})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studyPlan.dailyExample.slice(0, 3).map((day, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-semibold text-white mb-1">{day.day}</p>
                          <div className="space-y-1 text-slate-400">
                            {day.activities.slice(0, 3).map((activity, actIdx) => (
                              <p key={actIdx}>• {activity}</p>
                            ))}
                            {day.activities.length > 3 && (
                              <p className="text-slate-500">+ {day.activities.length - 3} more...</p>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{day.estimatedHours} hrs</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-slate-400 text-lg">
                    Fill in your information on the left to generate a personalized study plan.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
