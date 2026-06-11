// Study plan generation logic

export interface StudyWeek {
  week: number;
  goal: string;
  topics: string[];
  tasks: string[];
  checkpoint: string;
  estimatedHours: number;
}

export interface DailySchedule {
  day: string;
  activities: string[];
  estimatedHours: number;
}

export interface PriorityArea {
  area: string;
  priority: "high" | "medium" | "low";
  reason: string;
  hoursPerWeek: number;
}

export interface StudyPlan {
  examType: string;
  currentScore: number;
  targetScore: number;
  weeksUntilTest: number;
  hoursPerWeek: number;
  weakAreas: string[];
  summary: string;
  priorities: PriorityArea[];
  weeks: StudyWeek[];
  dailyExample: DailySchedule[];
  nextBestStep: string;
}

export function generateStudyPlan(
  examType: string,
  currentScore: number,
  targetScore: number,
  testDate: string | null,
  hoursPerWeek: number,
  weakAreas: string[],
  studyStyle: "short_daily" | "long_weekend" | "balanced" = "balanced",
  subject?: string
): StudyPlan {
  // Calculate weeks until test
  let weeksUntilTest = 4;
  if (testDate) {
    const now = new Date();
    const exam = new Date(testDate);
    const diffMs = exam.getTime() - now.getTime();
    weeksUntilTest = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)));
  }

  // Generate priorities based on exam type and weak areas
  const priorities = generatePriorities(examType, weakAreas, currentScore, targetScore, hoursPerWeek);

  // Generate weekly plans
  const weeks = generateWeeklyPlans(
    examType,
    weeksUntilTest,
    currentScore,
    targetScore,
    hoursPerWeek,
    weakAreas,
    subject
  );

  // Generate daily example schedule
  const dailyExample = generateDailySchedule(studyStyle, hoursPerWeek, weakAreas);

  // Generate summary
  const summary = generateSummary(examType, currentScore, targetScore, weeksUntilTest);

  // Generate next best step
  const nextBestStep = generateNextBestStep(examType, weakAreas, subject);

  return {
    examType,
    currentScore,
    targetScore,
    weeksUntilTest,
    hoursPerWeek,
    weakAreas,
    summary,
    priorities,
    weeks,
    dailyExample,
    nextBestStep,
  };
}

function generatePriorities(
  examType: string,
  weakAreas: string[],
  currentScore: number,
  targetScore: number,
  hoursPerWeek: number
): PriorityArea[] {
  const priorities: PriorityArea[] = [];
  const scoreGap = targetScore - currentScore;

  if (examType === "SAT") {
    // Math vs Reading/Writing prioritization
    const mathWeak = weakAreas.some((a) =>
      [
        "Algebra",
        "Advanced Math",
        "Problem Solving",
        "Geometry",
        "Trigonometry",
      ].some((m) => a.toLowerCase().includes(m.toLowerCase()))
    );

    const readingWeak = weakAreas.some((a) =>
      [
        "Reading",
        "Grammar",
        "Vocabulary",
        "Time management",
      ].some((m) => a.toLowerCase().includes(m.toLowerCase()))
    );

    if (mathWeak) {
      priorities.push({
        area: "Math",
        priority: "high",
        reason: "Math is your weakest area and higher ROI for improvement",
        hoursPerWeek: Math.ceil(scoreGap > 200 ? 5 : 4),
      });
    }

    if (readingWeak) {
      priorities.push({
        area: "Reading & Writing",
        priority: mathWeak ? "medium" : "high",
        reason: "Reading & Writing needs focused practice",
        hoursPerWeek: Math.ceil(scoreGap > 200 ? 4 : 3),
      });
    }

    if (!mathWeak && !readingWeak) {
      priorities.push({
        area: "Balanced Review",
        priority: "high",
        reason: "Maintain both sections while aiming for top performance",
        hoursPerWeek: Math.ceil((hoursPerWeek * 2) / 3),
      });
    }
  } else if (examType === "ACT") {
    // Identify 2-3 most impactful areas
    const scienceWeak = weakAreas.includes("Science data interpretation");
    const readingWeak = weakAreas.includes("Reading speed");
    const mathWeak = weakAreas.some((a) => a.includes("Algebra") || a.includes("Geometry"));

    if (scienceWeak) {
      priorities.push({
        area: "Science Reasoning",
        priority: "high",
        reason: "Science section has big scoring potential",
        hoursPerWeek: 3,
      });
    }

    if (readingWeak) {
      priorities.push({
        area: "Reading Speed & Comprehension",
        priority: "high",
        reason: "Time management is critical in Reading section",
        hoursPerWeek: 3,
      });
    }

    if (mathWeak) {
      priorities.push({
        area: "Math Fundamentals",
        priority: "high",
        reason: "Algebra and geometry appear frequently",
        hoursPerWeek: 2,
      });
    }

    if (priorities.length === 0) {
      priorities.push({
        area: "Full Test Practice",
        priority: "high",
        reason: "Build endurance and timing across all sections",
        hoursPerWeek: hoursPerWeek,
      });
    }
  } else if (examType === "AP") {
    // Generic AP priorities
    if (weakAreas.length > 0) {
      priorities.push({
        area: weakAreas[0],
        priority: "high",
        reason: `${weakAreas[0]} is your biggest challenge—tackle it early`,
        hoursPerWeek: Math.ceil(hoursPerWeek * 0.5),
      });
    }

    priorities.push({
      area: "Multiple-Choice Mastery",
      priority: "high",
      reason: "Multiple-choice makes up 50% of your AP exam score",
      hoursPerWeek: Math.ceil(hoursPerWeek * 0.3),
    });

    priorities.push({
      area: "Free-Response Practice",
      priority: "medium",
      reason: "FRQ format requires different preparation strategy",
      hoursPerWeek: Math.ceil(hoursPerWeek * 0.2),
    });
  }

  return priorities;
}

function generateWeeklyPlans(
  examType: string,
  weeksUntilTest: number,
  currentScore: number,
  targetScore: number,
  hoursPerWeek: number,
  weakAreas: string[],
  subject?: string
): StudyWeek[] {
  const weeks: StudyWeek[] = [];
  const numWeeks = Math.min(weeksUntilTest, 4);

  for (let i = 1; i <= numWeeks; i++) {
    const isLastWeek = i === numWeeks;

    if (examType === "SAT") {
      weeks.push(generateSATWeek(i, isLastWeek, weakAreas));
    } else if (examType === "ACT") {
      weeks.push(generateACTWeek(i, isLastWeek, weakAreas));
    } else if (examType === "AP") {
      weeks.push(generateAPWeek(i, isLastWeek, weakAreas, subject || ""));
    }
  }

  return weeks;
}

function generateSATWeek(weekNum: number, isLastWeek: boolean, weakAreas: string[]): StudyWeek {
  const mathWeak = weakAreas.some((a) => a.includes("Math") || a.includes("Algebra"));

  switch (weekNum) {
    case 1:
      return {
        week: 1,
        goal: "Diagnostic & Skill Mapping",
        topics: ["Take full diagnostic", "Analyze weaknesses", "Review scoring breakdown"],
        tasks: [
          "Complete 1 full SAT practice test (3h 15min)",
          "Review all missed questions with explanations",
          "Identify error patterns (careless vs. concept gaps)",
          "Create weakness list by topic",
        ],
        checkpoint: "Diagnostic test score and error analysis",
        estimatedHours: 6,
      };
    case 2:
      return {
        week: 2,
        goal: mathWeak ? "Math Strategy & Fundamentals" : "Reading & Writing Precision",
        topics: mathWeak
          ? ["Algebra review", "Advanced math tactics", "Problem-solving strategies"]
          : ["Grammar rules", "Reading strategies", "Vocabulary building"],
        tasks: mathWeak
          ? [
              "Review algebra fundamentals (2h)",
              "Practice problem-solving techniques (2h)",
              "Timed drills on weak math topics (1.5h)",
              "Review tricky problems from Week 1",
            ]
          : [
              "Grammar rules intensive (2h)",
              "Reading strategy practice (2h)",
              "Vocabulary in context drills (1.5h)",
              "Passage-based practice",
            ],
        checkpoint: "Progress quiz on focused topic",
        estimatedHours: 6.5,
      };
    case 3:
      return {
        week: 3,
        goal: "Timed Section Practice & Full Tests",
        topics: ["Timing strategies", "Full test practice", "Pacing mastery"],
        tasks: [
          "Take 1 full SAT practice test timed (3h 15min)",
          "Timed section drills: 2x Math (1.5h each)",
          "Timed section drills: 2x Reading & Writing (1h each)",
          "Review all mistakes and categorize errors",
        ],
        checkpoint: "Section scores and timing notes",
        estimatedHours: 7,
      };
    case 4:
      return {
        week: 4,
        goal: isLastWeek ? "Final Review & Test-Day Readiness" : "Weak Area Intensive",
        topics: isLastWeek
          ? ["Confidence building", "Review tricky topics", "Test-day strategies"]
          : ["Deep dive into weaknesses", "Timed practice", "Error review"],
        tasks: isLastWeek
          ? [
              "Take 1 final practice test (3h 15min)",
              "Review weak areas one more time (1h)",
              "Do easy-to-medium drills to build confidence (1h)",
              "Prepare test-day materials and timing",
            ]
          : [
              "Take another full practice test (3h 15min)",
              "2h deep review of weak area",
              "1h timed drills on specific weak topics",
              "Error review and pattern analysis",
            ],
        checkpoint: "Final practice test score",
        estimatedHours: 5.25,
      };
    default:
      return {
        week: weekNum,
        goal: "Practice & Review",
        topics: ["Practice tests", "Error review", "Concept reinforcement"],
        tasks: ["Complete practice problems", "Review mistakes", "Strengthen weak areas"],
        checkpoint: "Progress check",
        estimatedHours: 6,
      };
  }
}

function generateACTWeek(weekNum: number, isLastWeek: boolean, weakAreas: string[]): StudyWeek {
  const scienceWeak = weakAreas.includes("Science data interpretation");

  switch (weekNum) {
    case 1:
      return {
        week: 1,
        goal: "Diagnostic & ACT Format Mastery",
        topics: ["ACT structure", "Timing overview", "Section breakdown"],
        tasks: [
          "Take 1 full ACT practice test (3h 30min)",
          "Learn ACT-specific strategies for each section",
          "Analyze timing patterns",
          "Identify strongest and weakest sections",
        ],
        checkpoint: "Composite score and section breakdown",
        estimatedHours: 6,
      };
    case 2:
      return {
        week: 2,
        goal: scienceWeak ? "Science Reasoning Strategy" : "English & Math Speed",
        topics: scienceWeak
          ? ["Data interpretation", "Graph analysis", "Research summaries"]
          : ["Grammar drills", "Math shortcuts", "Pacing tactics"],
        tasks: scienceWeak
          ? [
              "Science data drills (2h)",
              "Practice interpreting charts and graphs (1.5h)",
              "Timed science questions (1.5h)",
              "Review explanations for missed questions",
            ]
          : [
              "English grammar review (2h)",
              "Math shortcut drills (2h)",
              "Timed section practice (1.5h)",
              "Error pattern analysis",
            ],
        checkpoint: "Practice on weak section",
        estimatedHours: 7,
      };
    case 3:
      return {
        week: 3,
        goal: "Full Tests & Endurance Building",
        topics: ["Test-length practice", "Mental stamina", "All sections"],
        tasks: [
          "Take 2 full-length ACT practice tests (7h total)",
          "Practice back-to-back sections without breaks",
          "Analyze pacing and endurance patterns",
          "Review all weak sections",
        ],
        checkpoint: "Composite score trends",
        estimatedHours: 8,
      };
    case 4:
      return {
        week: 4,
        goal: isLastWeek
          ? "Final Confidence & Test-Day Strategy"
          : "Targeted Weak-Area Review",
        topics: isLastWeek
          ? ["Last-minute tips", "Test-day strategy", "Mindset"]
          : ["Weak section drills", "Full practice", "Error review"],
        tasks: isLastWeek
          ? [
              "Take 1 final full ACT (3h 30min)",
              "Review weak areas lightly (1h)",
              "Easy drills on each section (1h)",
              "Prepare test materials",
            ]
          : [
              "Take 1 full practice test (3h 30min)",
              "2h focused drills on weakest section",
              "1.5h targeted practice on problem areas",
              "Full error review",
            ],
        checkpoint: "Final practice score",
        estimatedHours: 5.5,
      };
    default:
      return {
        week: weekNum,
        goal: "Full Test Practice",
        topics: ["All ACT sections", "Timing", "Full tests"],
        tasks: ["Take full practice test", "Review all sections", "Build endurance"],
        checkpoint: "Composite score",
        estimatedHours: 6,
      };
  }
}

function generateAPWeek(
  weekNum: number,
  isLastWeek: boolean,
  weakAreas: string[],
  subject: string
): StudyWeek {
  switch (weekNum) {
    case 1:
      return {
        week: 1,
        goal: "Content Review & Diagnostic",
        topics: ["Major units", "Key concepts", "Diagnostic assessment"],
        tasks: [
          "Review all major units from class (3h)",
          "Take a diagnostic assessment or practice exam",
          "Identify biggest knowledge gaps",
          "Create study guide for weak areas",
        ],
        checkpoint: "Diagnostic score and gap analysis",
        estimatedHours: 6,
      };
    case 2:
      return {
        week: 2,
        goal: "Weak Area Deep Dive",
        topics: ["Concept building", "Practice problems", "FRQ examples"],
        tasks: [
          `Focus intensively on: ${weakAreas[0] || "main weakness"} (2h)`,
          "Work through FRQ examples and scoring rubrics (2h)",
          "Practice problems on weak topics (1.5h)",
          "Review correct solutions carefully",
        ],
        checkpoint: "Practice FRQ or problem set",
        estimatedHours: 6.5,
      };
    case 3:
      return {
        week: 3,
        goal: "Multiple-Choice & Timed Practice",
        topics: ["Multiple-choice strategy", "Pacing", "Full-length practice"],
        tasks: [
          "Take full-length practice exam under timed conditions (2.5h)",
          "Multiple-choice drills by unit (2h)",
          "Review all mistakes carefully (1.5h)",
          "Adjust strategies for weaker units",
        ],
        checkpoint: "Practice exam score",
        estimatedHours: 6.5,
      };
    case 4:
      return {
        week: 4,
        goal: isLastWeek
          ? "Final Review & Test-Day Prep"
          : "Comprehensive Practice & Polish",
        topics: isLastWeek
          ? ["Key concepts review", "Test-day strategy", "Confidence building"]
          : ["All content", "Full practice", "Error analysis"],
        tasks: isLastWeek
          ? [
              "Take 1 final practice exam (2.5h)",
              "Review top 10 tricky concepts (1.5h)",
              "Easy practice to build confidence (1h)",
              "Prepare test-day materials",
            ]
          : [
              "Take another full practice exam (2.5h)",
              "FRQ writing practice (1.5h)",
              "Multiple-choice review on weak units (1.5h)",
              "Comprehensive error analysis",
            ],
        checkpoint: "Final practice exam score",
        estimatedHours: 5,
      };
    default:
      return {
        week: weekNum,
        goal: "Review & Practice",
        topics: ["AP exam content", "FRQ & MC", "Practice"],
        tasks: ["Review concepts", "Practice problems", "Take practice exams"],
        checkpoint: "Practice exam",
        estimatedHours: 6,
      };
  }
}

function generateDailySchedule(
  studyStyle: string,
  hoursPerWeek: number,
  weakAreas: string[]
): DailySchedule[] {
  const schedule: DailySchedule[] = [];
  const dailyHours = hoursPerWeek / 7;

  if (studyStyle === "short_daily") {
    // 6-7 days with 1-1.5h each
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days.forEach((day, idx) => {
      schedule.push({
        day,
        activities: [
          `Warm-up drill (10 min)`,
          `Focused practice on ${weakAreas[idx % weakAreas.length] || "weak area"} (40 min)`,
          `Review mistakes and explanations (10 min)`,
        ],
        estimatedHours: 1,
      });
    });
    schedule.push({
      day: "Sunday",
      activities: ["Review the week", "Light practice", "Rest"],
      estimatedHours: 0.5,
    });
  } else if (studyStyle === "long_weekend") {
    // 2-3 longer sessions on weekends
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach((day) => {
      schedule.push({
        day,
        activities: ["Quick review (30 min)", "Light practice (30 min)"],
        estimatedHours: 1,
      });
    });
    schedule.push({
      day: "Saturday",
      activities: [
        "Full practice test or long drill session (2-3h)",
        "Review and analysis (1h)",
      ],
      estimatedHours: 3,
    });
    schedule.push({
      day: "Sunday",
      activities: ["Review weak areas", "Light reinforcement"],
      estimatedHours: 1,
    });
  } else {
    // Balanced: mix of shorter and longer sessions
    ["Monday", "Tuesday", "Thursday", "Saturday"].forEach((day) => {
      schedule.push({
        day,
        activities: [
          `Concept review (30 min)`,
          `Targeted practice (1h)`,
          `Review mistakes (15 min)`,
        ],
        estimatedHours: 1.75,
      });
    });
    ["Wednesday", "Friday"].forEach((day) => {
      schedule.push({
        day,
        activities: ["Light drills (30 min)", "Review (15 min)"],
        estimatedHours: 0.75,
      });
    });
    schedule.push({
      day: "Sunday",
      activities: ["Weekly review", "Plan for next week"],
      estimatedHours: 0.5,
    });
  }

  return schedule;
}

function generateSummary(
  examType: string,
  currentScore: number,
  targetScore: number,
  weeksUntilTest: number
): string {
  const gap = Math.abs(targetScore - currentScore);
  const realistic = gap <= 200;

  if (examType === "SAT") {
    return realistic
      ? `Your goal is achievable. Focus on your weak areas and maintain consistent practice over the next ${weeksUntilTest} weeks.`
      : `Your target is ambitious. Consider extending your study timeline or adjusting your target score.`;
  } else if (examType === "ACT") {
    return realistic
      ? `You can reach your target by focusing on timing and test-specific strategies.`
      : `Your goal is challenging. Ensure you have adequate time to master all sections.`;
  } else {
    return `You have ${weeksUntilTest} weeks to prepare. Use this plan to build deep content mastery and practice FRQs.`;
  }
}

function generateNextBestStep(
  examType: string,
  weakAreas: string[],
  subject?: string
): string {
  if (weakAreas.length === 0) {
    if (examType === "SAT") {
      return "Your next best step is to take a full-length SAT practice test to identify specific weaknesses.";
    } else if (examType === "ACT") {
      return "Your next best step is to take a full-length ACT to establish your baseline score.";
    } else {
      return "Your next best step is to review the major units and take a diagnostic test.";
    }
  }

  const mainWeak = weakAreas[0];
  if (examType === "SAT") {
    if (mainWeak.includes("Math")) {
      return `Your next best step is to complete a diagnostic on ${mainWeak} concepts and identify specific gaps.`;
    } else {
      return `Your next best step is to master ${mainWeak} using targeted drills and passage practice.`;
    }
  } else if (examType === "ACT") {
    return `Your next best step is to focus on ${mainWeak} with timed practice and error review.`;
  } else {
    return `Your next best step is to review ${mainWeak} and practice FRQs related to this topic.`;
  }
}
