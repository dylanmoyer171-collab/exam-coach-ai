"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [exam, setExam] = useState("SAT");
  const [helpful, setHelpful] = useState("");
  const [confusing, setConfusing] = useState("");
  const [featureRequest, setFeatureRequest] = useState("");
  const [wouldUseAgain, setWouldUseAgain] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!exam) {
      newErrors.push("Select an exam type");
    }
    if (!helpful && !confusing && !featureRequest) {
      newErrors.push("Please provide at least one piece of feedback");
    }
    if (!wouldUseAgain) {
      newErrors.push("Please answer if you would use Exam Coach AI again");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save to localStorage
    const feedback = {
      id: Date.now(),
      name: name || "Anonymous",
      email: email || "not provided",
      exam,
      helpful,
      confusing,
      featureRequest,
      wouldUseAgain,
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(localStorage.getItem("feedbackEntries") || "[]");
    existingFeedback.push(feedback);
    localStorage.setItem("feedbackEntries", JSON.stringify(existingFeedback));

    setSubmitted(true);
    setErrors([]);
    // Reset form
    setTimeout(() => {
      setName("");
      setEmail("");
      setExam("SAT");
      setHelpful("");
      setConfusing("");
      setFeatureRequest("");
      setWouldUseAgain("");
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8 flex items-center justify-center">
        <Card className="max-w-md border-green-500/30 bg-green-950/20">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Thank You!</h2>
              <p className="text-slate-300">
                Your feedback has been saved. We appreciate your input and will use it to improve Exam Coach AI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Send Us Feedback</h1>
          <p className="text-lg text-slate-400">
            Help us improve Exam Coach AI. Your feedback is valuable and helps us build a better tool for students.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>
              All fields except name and email are optional. Your feedback is saved locally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Only used if we need to follow up on your feedback
                </p>
              </div>

              {/* Exam */}
              <div>
                <Label htmlFor="exam">Which exam were you preparing for?</Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger id="exam" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAT">SAT</SelectItem>
                    <SelectItem value="ACT">ACT</SelectItem>
                    <SelectItem value="AP">AP Exam</SelectItem>
                    <SelectItem value="Multiple">Multiple exams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Helpful */}
              <div>
                <Label htmlFor="helpful">What was most helpful?</Label>
                <textarea
                  id="helpful"
                  placeholder="e.g., The score predictor was really motivating... The study plan template was easy to follow..."
                  value={helpful}
                  onChange={(e) => setHelpful(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  rows={3}
                />
              </div>

              {/* Confusing */}
              <div>
                <Label htmlFor="confusing">What was confusing or hard to use?</Label>
                <textarea
                  id="confusing"
                  placeholder="e.g., I didn't understand how to use the weak areas selector... The daily schedule format was hard to follow..."
                  value={confusing}
                  onChange={(e) => setConfusing(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  rows={3}
                />
              </div>

              {/* Feature Request */}
              <div>
                <Label htmlFor="feature">Feature request or other ideas?</Label>
                <textarea
                  id="feature"
                  placeholder="e.g., I would love a feature to track test scores over time... It would be helpful to have a section on test-day tips..."
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  rows={3}
                />
              </div>

              {/* Would Use Again */}
              <div>
                <Label htmlFor="useAgain">Would you use Exam Coach AI again?</Label>
                <Select value={wouldUseAgain} onValueChange={setWouldUseAgain}>
                  <SelectTrigger id="useAgain" className="mt-1">
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, definitely</SelectItem>
                    <SelectItem value="maybe">Maybe (need improvements)</SelectItem>
                    <SelectItem value="no">No, not for me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="rounded-lg border border-red-500/50 bg-red-950/20 p-4 space-y-2">
                  {errors.map((err, idx) => (
                    <div key={idx} className="flex gap-2 text-sm text-red-300">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {err}
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full">
                Submit Feedback
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">
                <strong>Privacy Note:</strong> Your feedback is stored locally in your browser and never sent to a server.
                It won't be shared or used for any purpose other than improving Exam Coach AI.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Other Ways to Help</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span>📱</span>
              <span>
                <strong>Share with friends:</strong> If you find Exam Coach AI helpful, tell your friends and classmates.
                Word-of-mouth is the best feedback.
              </span>
            </li>
            <li className="flex gap-3">
              <span>⭐</span>
              <span>
                <strong>Rate this tool:</strong> If this site is available on app stores or extension marketplaces, a rating
                helps others discover it.
              </span>
            </li>
            <li className="flex gap-3">
              <span>🐛</span>
              <span>
                <strong>Report bugs:</strong> Found something broken? Let us know in your feedback so we can fix it quickly.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
