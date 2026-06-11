"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Video, FileText, Lightbulb } from "lucide-react";

const resources = [
  {
    category: "Official Practice",
    icon: FileText,
    items: [
      {
        title: "SAT Practice Tests",
        description: "Free official SAT practice tests directly from College Board",
        link: "https://satsuite.collegeboard.org/sat/practice-and-support",
        exam: "SAT",
      },
      {
        title: "Khan Academy SAT Prep",
        description: "Free comprehensive SAT prep with video lessons and practice",
        link: "https://www.khanacademy.org/test-prep/sat",
        exam: "SAT",
      },
      {
        title: "ACT Practice Tests",
        description: "Official ACT practice tests and resources",
        link: "https://www.act.org/content/act/html/students/preparing-for-the-act.html",
        exam: "ACT",
      },
      {
        title: "ACT Academy",
        description: "Free personalized study plans for ACT prep",
        link: "https://www.act.org/content/act/html/act-academy.html",
        exam: "ACT",
      },
      {
        title: "AP Classroom",
        description: "Official AP Exam prep with practice questions and FRQs",
        link: "https://apclassroom.collegeboard.org/",
        exam: "AP",
      },
    ],
  },
  {
    category: "Study Strategies",
    icon: Lightbulb,
    items: [
      {
        title: "Active Recall & Spaced Repetition",
        description: "Learn why testing yourself is more effective than re-reading",
        link: "https://en.wikipedia.org/wiki/Testing_effect",
        exam: "All",
      },
      {
        title: "Feynman Technique",
        description: "A method for learning and retaining information effectively",
        link: "https://www.mindtools.com/pages/article/feynman-technique.htm",
        exam: "All",
      },
      {
        title: "Pomodoro Technique",
        description: "Time management method using 25-minute focused study sessions",
        link: "https://en.wikipedia.org/wiki/Pomodoro_Technique",
        exam: "All",
      },
      {
        title: "Test-Driven Learning",
        description: "Use practice tests to drive your study focus and identify weak areas",
        link: "https://www.learningscientists.org/learning-scientists-blog",
        exam: "All",
      },
    ],
  },
  {
    category: "Video Resources",
    icon: Video,
    items: [
      {
        title: "Khan Academy SAT Math",
        description: "Free video lessons for all SAT Math topics",
        link: "https://www.khanacademy.org/test-prep/sat/sat-math",
        exam: "SAT",
      },
      {
        title: "PatrickJMT Calculus",
        description: "Clear explanations of calculus concepts (AP Calc prep)",
        link: "https://www.youtube.com/user/patrickJMT",
        exam: "AP",
      },
      {
        title: "Crash Course Series",
        description: "High-quality educational videos for science and history topics",
        link: "https://www.youtube.com/user/crashcourse",
        exam: "AP",
      },
      {
        title: "Professor Leonard",
        description: "In-depth calculus lectures perfect for AP Calc review",
        link: "https://www.youtube.com/c/ProfessorLeonard",
        exam: "AP",
      },
    ],
  },
  {
    category: "Test Anxiety & Time Management",
    icon: Lightbulb,
    items: [
      {
        title: "Dealing with Test Anxiety",
        description: "Evidence-based strategies to manage anxiety during exams",
        link: "https://www.apa.org/science/about/psa/test-anxiety",
        exam: "All",
      },
      {
        title: "Sleep & Learning",
        description: "Why sleep is crucial for memory consolidation and test performance",
        link: "https://sleep.org/articles/how-sleep-affects-learning/",
        exam: "All",
      },
      {
        title: "SAT Time Management Tips",
        description: "Strategies for pacing yourself through SAT sections",
        link: "https://satsuite.collegeboard.org/sat/practice-and-support",
        exam: "SAT",
      },
      {
        title: "ACT Speed Reading Strategies",
        description: "Tips for improving reading speed and comprehension",
        link: "https://www.act.org/content/act/html/students/preparing-for-the-act.html",
        exam: "ACT",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Free Study Resources</h1>
          <p className="text-xl text-slate-400 mb-8">
            A curated collection of the best free resources for SAT, ACT, and AP exam prep.
          </p>
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
            <p className="text-slate-200">
              <strong>Pro Tip:</strong> The best resource is deliberate practice with official tests. Use these materials to supplement your study plan and fill knowledge gaps.
            </p>
          </div>
        </div>

        {/* Resources by Category */}
        <div className="space-y-12">
          {resources.map((section, idx) => (
            <div key={idx}>
              <div className="mb-6 flex items-center gap-3">
                <section.icon className="h-8 w-8 text-cyan-300" />
                <h2 className="text-3xl font-bold text-white">{section.category}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {section.items.map((item, itemIdx) => (
                  <Card key={itemIdx} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {item.exam}
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tips Section */}
        <div className="mt-16 rounded-lg border border-slate-700 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use These Resources Effectively</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "1. Start with Your Study Plan",
                desc: "Use Exam Coach AI to identify your weak areas and prioritize them. This ensures you use resources strategically, not randomly.",
              },
              {
                title: "2. Official Tests First",
                desc: "Always start with official practice tests from College Board, ACT, or AP Classroom. These are the most accurate reflection of the real exam.",
              },
              {
                title: "3. Fill Knowledge Gaps",
                desc: "After identifying weak areas on practice tests, use videos and study guides from Khan Academy, Crash Course, or other resources.",
              },
              {
                title: "4. Practice, Then Review",
                desc: "Do practice questions, check your answers, understand why you missed them, and review similar topics. Avoid just watching videos.",
              },
              {
                title: "5. Track Your Progress",
                desc: "Your study plan includes progress tracking. Check off completed tasks and monitor your score improvements over time.",
              },
              {
                title: "6. Adjust Based on Results",
                desc: "If a resource isn't helping or you're running out of time, pivot. Your study plan should be flexible based on your actual performance.",
              },
            ].map((tip, idx) => (
              <div key={idx} className="border-l-2 border-cyan-500 pl-4">
                <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-sm text-slate-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-sm text-slate-500 border-t border-slate-700 pt-8">
          <p>
            Exam Coach AI is an independent study planning tool. Not affiliated with College Board, ACT, or AP.
          </p>
          <p className="mt-2">
            All external links are provided for convenience. Please verify the accuracy and availability of resources before relying on them.
          </p>
        </div>
      </div>
    </div>
  );
}
