export type DiagnosticExamType = "SAT" | "ACT" | "AP";

export type DiagnosticQuestion = {
  id: string;
  exam: DiagnosticExamType;
  category: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export const DIAGNOSTIC_QUESTIONS: Record<DiagnosticExamType, DiagnosticQuestion[]> = {
  SAT: [
    {
      id: "sat-algebra",
      exam: "SAT",
      category: "Algebra",
      question: "If 3x + 5 = 20, what is x?",
      choices: ["3", "5", "10", "15"],
      answer: "5",
      explanation: "Solve 3x + 5 = 20 by subtracting 5, then divide by 3: x = 5.",
    },
    {
      id: "sat-reading",
      exam: "SAT",
      category: "Reading",
      question:
        "The passage suggests the author most likely believes that teamwork is:",
      choices: [
        "a distraction from personal goals",
        "a source of shared strength",
        "an outdated workplace habit",
        "a reason to avoid responsibility",
      ],
      answer: "a source of shared strength",
      explanation:
        "The tone of the passage emphasizes collaboration and mutual support, so the author treats teamwork as a source of strength.",
    },
    {
      id: "sat-grammar",
      exam: "SAT",
      category: "Grammar",
      question:
        "Which choice correctly completes the sentence?\nBy the time the project is due, the team _____ all of the edits.",
      choices: ["will have made", "will make", "has made", "made"],
      answer: "will have made",
      explanation:
        "The sentence uses a future deadline, so the future perfect tense 'will have made' is correct.",
    },
    {
      id: "sat-data",
      exam: "SAT",
      category: "Data Analysis",
      question:
        "A graph shows that sales increased by 20% from January to February. If February sales were $1200, what were January sales?",
      choices: ["$960", "$1000", "$1020", "$1080"],
      answer: "$1000",
      explanation:
        "If February is 20% higher than January, then January was $1200 / 1.2 = $1000.",
    },
    {
      id: "sat-timing",
      exam: "SAT",
      category: "Timing",
      question:
        "You have 35 minutes for 44 questions. What is the best pacing strategy?",
      choices: [
        "Spend 1 min per question and skip hard ones",
        "Answer every question in order without skipping",
        "Spend 45 seconds per question and review only if time remains",
        "Skip the first 10 questions to save time",
      ],
      answer: "Spend 45 seconds per question and review only if time remains",
      explanation:
        "Effective pacing on the SAT is consistent 45-second work with review time reserved for mistakes.",
    },
  ],
  ACT: [
    {
      id: "act-english",
      exam: "ACT",
      category: "Grammar",
      question:
        "Choose the best revision: 'Every student and teacher (has/have) praised the new schedule.'",
      choices: ["has", "have", "is", "are"],
      answer: "has",
      explanation:
        "The compound subject joined by 'and' is treated as a single unit in this context, so 'has' is correct.",
    },
    {
      id: "act-algebra",
      exam: "ACT",
      category: "Algebra",
      question: "If 2(3x - 4) = 14, what is x?",
      choices: ["11/3", "4", "5", "7"],
      answer: "11/3",
      explanation: "Divide both sides by 2 to get 3x - 4 = 7, then add 4 and divide by 3: x = 11/3.",
    },
    {
      id: "act-reading",
      exam: "ACT",
      category: "Reading",
      question:
        "The passage most likely implies that the speaker is feeling:",
      choices: ["confident", "hesitant", "bored", "frustrated"],
      answer: "hesitant",
      explanation:
        "The wording highlights uncertainty and reservations, so 'hesitant' is the best match.",
    },
    {
      id: "act-science",
      exam: "ACT",
      category: "Science",
      question:
        "A chart shows temperature rising while pressure stays constant. This suggests the gas is:",
      choices: ["heated", "cooled", "compressed", "expanded"],
      answer: "heated",
      explanation:
        "For a fixed volume and constant pressure, a temperature increase means the gas is being heated.",
    },
    {
      id: "act-timing",
      exam: "ACT",
      category: "Pacing",
      question:
        "The ACT Math section has 60 questions in 60 minutes. The best pace is:",
      choices: ["1 min/question", "30 sec/question", "2 min/question", "1.5 min/question"],
      answer: "1 min/question",
      explanation:
        "ACT Math requires a steady pace of roughly one minute per question to finish the section." ,
    },
  ],
  AP: [
    {
      id: "ap-concept1",
      exam: "AP",
      category: "Biology Concepts",
      question:
        "Which process produces ATP in the mitochondria during cellular respiration?",
      choices: ["Glycolysis", "Krebs cycle", "Oxidative phosphorylation", "Fermentation"],
      answer: "Oxidative phosphorylation",
      explanation:
        "Most ATP in cellular respiration comes from oxidative phosphorylation in the mitochondria.",
    },
    {
      id: "ap-concept2",
      exam: "AP",
      category: "Calculus Concepts",
      question:
        "What is the derivative of f(x) = x^3?",
      choices: ["3x^2", "x^2", "3x", "x^3"],
      answer: "3x^2",
      explanation: "The power rule gives f'(x) = 3x^2 for x^3.",
    },
    {
      id: "ap-reading",
      exam: "AP",
      category: "Historical Reasoning",
      question:
        "An author calls the law 'a last resort.' This most likely means the law is:",
      choices: ["popular", "unnecessary", "reluctantly accepted", "in effect immediately"],
      answer: "reluctantly accepted",
      explanation:
        "'Last resort' implies the law was accepted unwillingly after other options failed.",
    },
    {
      id: "ap-statistics",
      exam: "AP",
      category: "Statistics Concepts",
      question:
        "A survey reports a sample mean of 52 with a low margin of error. This suggests the result is:",
      choices: ["unreliable", "precise", "biased", "invalid"],
      answer: "precise",
      explanation:
        "A low margin of error usually indicates a precise estimate of the population mean.",
    },
    {
      id: "ap-writing",
      exam: "AP",
      category: "Argument Analysis",
      question:
        "A strong thesis in an essay should be:",
      choices: ["vague", "too broad", "specific and debatable", "irrelevant"],
      answer: "specific and debatable",
      explanation:
        "AP essays require a clear position that can be argued with evidence, so it should be specific and debatable.",
    },
  ],
};

export type DiagnosticPlanDay = {
  day: string;
  focus: string;
  tasks: string[];
};

export type DiagnosticResult = {
  correctCount: number;
  total: number;
  levelLabel: string;
  levelNote: string;
  strengths: string[];
  weakAreas: string[];
  missedQuestions: DiagnosticQuestion[];
  recommendations: string[];
  plan: DiagnosticPlanDay[];
};

const LEVEL_LABELS: Record<DiagnosticExamType, string[]> = {
  SAT: ["Review Fundamentals", "Developing", "On Track", "Strong"],
  ACT: ["Review Fundamentals", "Developing", "On Track", "Strong"],
  AP: ["Review Core Topics", "Developing", "On Track", "Exam Ready"],
};

const SCORE_NOTES: Record<string, string> = {
  low: "Start with shorter study sessions and build confidence with fundamentals.",
  medium: "Keep practicing targeted topics and add quick review sets.",
  high: "Push harder practice sets and timed sections to keep growing." ,
};

export function gradeDiagnostic(
  exam: DiagnosticExamType,
  selectedAnswers: Record<string, string>
): DiagnosticResult {
  const questions = DIAGNOSTIC_QUESTIONS[exam];
  const total = questions.length;
  const correctCount = questions.reduce((count, question) => {
    const answer = selectedAnswers[question.id];
    return answer === question.answer ? count + 1 : count;
  }, 0);

  const missedQuestions = questions.filter(
    (question) => selectedAnswers[question.id] !== question.answer
  );

  const strengths = Array.from(
    new Set(
      questions
        .filter((question) => selectedAnswers[question.id] === question.answer)
        .map((question) => question.category)
    )
  );

  const weakAreas = Array.from(new Set(missedQuestions.map((question) => question.category)));

  const scoreTier = correctCount <= 2 ? "low" : correctCount <= 4 ? "medium" : "high";
  const levelIndex = Math.min(3, Math.max(0, Math.floor((correctCount / total) * 4)));
  const levelLabel = LEVEL_LABELS[exam][levelIndex];
  const levelNote = SCORE_NOTES[scoreTier];

  const recommendations = buildRecommendations(exam, weakAreas, scoreTier);
  const plan = buildStudyPlan(exam, weakAreas, scoreTier);

  return {
    correctCount,
    total,
    levelLabel,
    levelNote,
    strengths,
    weakAreas,
    missedQuestions,
    recommendations,
    plan,
  };
}

function buildRecommendations(
  exam: DiagnosticExamType,
  weakAreas: string[],
  scoreTier: "low" | "medium" | "high"
): string[] {
  const recs: string[] = [];

  if (weakAreas.some((area) => area.toLowerCase().includes("algebra"))) {
    recs.push("Focus on algebra practice with equation solving and function review.");
  }
  if (weakAreas.some((area) => area.toLowerCase().includes("reading"))) {
    recs.push("Work on reading strategies: passage mapping, active annotation, and inference skills.");
  }
  if (weakAreas.some((area) => area.toLowerCase().includes("timing") || area.toLowerCase().includes("pacing"))) {
    recs.push("Train your pacing with timed sections and skip-to-review strategies.");
  }
  if (exam === "AP" && weakAreas.length > 0) {
    recs.push("Review the core AP topic concepts and practice short response questions.");
  }
  if (scoreTier === "high") {
    recs.push("Try harder practice sets and full timed sections to push your score higher.");
  }
  if (scoreTier === "low") {
    recs.push("Use shorter review sessions and focus on building accuracy before speed.");
  }
  if (recs.length === 0) {
    recs.push("Keep going with balanced practice, focusing on consistency and timing.");
  }

  return recs;
}

function buildStudyPlan(
  exam: DiagnosticExamType,
  weakAreas: string[],
  scoreTier: "low" | "medium" | "high"
): DiagnosticPlanDay[] {
  const focus = weakAreas.length > 0 ? weakAreas[0] : "Core concepts";
  const secondFocus = weakAreas[1] || "Practice strategy";
  const dailyHours = scoreTier === "low" ? "30–45 minutes" : scoreTier === "medium" ? "45–60 minutes" : "60–75 minutes";

  const dayTasks = [
    {
      day: "Day 1",
      focus: `Review ${focus}`,
      tasks: [
        `Read through key ${focus.toLowerCase()} rules and definitions.`,
        `Work on 5 targeted practice questions for ${focus.toLowerCase()}.`,
      ],
    },
    {
      day: "Day 2",
      focus: `Practice ${secondFocus}`,
      tasks: [
        `Complete a short practice set focused on ${secondFocus.toLowerCase()}.`,
        `Write down one takeaway and one question to revisit.`,
      ],
    },
    {
      day: "Day 3",
      focus: "Timed practice",
      tasks: [
        `Do a 20-minute timed set to build pacing.`,
        `Review every missed question and read the explanations.`,
      ],
    },
    {
      day: "Day 4",
      focus: "Weak area review",
      tasks: [
        `Go deeper into your missed topics and redo similar questions.`,
        `Practice one concept summary or quick note sheet.`,
      ],
    },
    {
      day: "Day 5",
      focus: "Mixed review",
      tasks: [
        `Mix 5 questions from different sections.`,
        `Focus on accuracy first, then speed on the second pass.`,
      ],
    },
    {
      day: "Day 6",
      focus: "Speed and confidence",
      tasks: [
        `Do a rapid review of the hardest question types.`,
        `Use timing strategies for at least 20 minutes.`,
      ],
    },
    {
      day: "Day 7",
      focus: "Reflection and planning",
      tasks: [
        `Review your mistakes and update your weak areas list.`,
        `Set your next study goals for the coming week.`,
      ],
    },
  ];

  if (scoreTier === "low") {
    dayTasks[2].tasks = [
      `Try a short 15-minute timed set to avoid burnout.`,
      `Review only the questions you missed and correct the steps.`,
    ];
  }

  if (scoreTier === "high") {
    dayTasks[5].tasks = [
      `Push through a full timed section that mimics the real exam.`,
      `Review advanced practice questions and note time-saving moves.`,
    ];
  }

  if (exam === "AP") {
    dayTasks[0].tasks[0] = `Review the key concept behind ${focus.toLowerCase()}.`;
    dayTasks[1].tasks[1] = `Write a short explanation or formula summary for ${secondFocus.toLowerCase()}.`;
    dayTasks[4].tasks[0] = `Mix multiple-choice and written practice items.`;
  }

  return dayTasks;
}
