const ANSWER_KEYS = {
  SAT: {
    'sat-algebra': '5',
    'sat-reading': 'a source of shared strength',
    'sat-grammar': 'will have made',
    'sat-data': '$1000',
    'sat-timing': 'Spend 45 seconds per question and review only if time remains',
  },
  ACT: {
    'act-english': 'has',
    'act-algebra': '11/3',
    'act-reading': 'hesitant',
    'act-science': 'heated',
    'act-timing': '1 min/question',
  },
  AP: {
    'ap-concept1': 'Oxidative phosphorylation',
    'ap-concept2': '3x^2',
    'ap-reading': 'reluctantly accepted',
    'ap-statistics': 'precise',
    'ap-writing': 'specific and debatable',
  },
};

const CATEGORY_MAP = {
  'sat-algebra': 'Algebra',
  'sat-reading': 'Reading',
  'sat-grammar': 'Grammar',
  'sat-data': 'Data Analysis',
  'sat-timing': 'Timing',
  'act-english': 'Grammar',
  'act-algebra': 'Algebra',
  'act-reading': 'Reading',
  'act-science': 'Science',
  'act-timing': 'Pacing',
  'ap-concept1': 'Biology Concepts',
  'ap-concept2': 'Calculus Concepts',
  'ap-reading': 'Historical Reasoning',
  'ap-statistics': 'Statistics Concepts',
  'ap-writing': 'Argument Analysis',
};

function getMockResult(examType, selectedAnswers) {
  const answerKey = ANSWER_KEYS[examType] || {};
  const questionIds = Object.keys(answerKey);
  const correctCount = questionIds.reduce((count, questionId) => {
    return selectedAnswers[questionId] === answerKey[questionId] ? count + 1 : count;
  }, 0);

  const strengths = questionIds.filter((questionId) => selectedAnswers[questionId] === answerKey[questionId]).map((questionId) => CATEGORY_MAP[questionId]);
  const weakAreas = questionIds.filter((questionId) => selectedAnswers[questionId] !== answerKey[questionId]).map((questionId) => CATEGORY_MAP[questionId]);

  const scoreTier = correctCount <= 2 ? 'low' : correctCount <= 4 ? 'medium' : 'high';
  const levelLabel = correctCount <= 1 ? 'Review Fundamentals' : correctCount <= 3 ? 'Developing' : correctCount <= 4 ? 'On Track' : examType === 'AP' ? 'Exam Ready' : 'Strong';
  const levelNote = scoreTier === 'low'
    ? 'Start with shorter study sessions and build confidence with fundamentals.'
    : scoreTier === 'medium'
      ? 'Keep practicing targeted topics and add quick review sets.'
      : 'Push harder practice sets and timed sections to keep growing.';

  return {
    correctCount,
    total: questionIds.length,
    levelLabel,
    levelNote,
    strengths: Array.from(new Set(strengths)),
    weakAreas: Array.from(new Set(weakAreas)),
    missedQuestions: [],
    recommendations: [
      weakAreas.length > 0 ? `Focus on ${weakAreas[0].toLowerCase()} first.` : 'Keep reviewing the core concepts and pacing.',
      scoreTier === 'high' ? 'Add timed practice sets to keep improving.' : 'Practice one targeted question set each day.',
    ],
    plan: [
      { day: 'Day 1', focus: 'Review core concepts', tasks: ['Go over the highest-impact missed topics.'] },
      { day: 'Day 2', focus: 'Targeted practice', tasks: ['Complete a short set of mixed practice questions.'] },
      { day: 'Day 3', focus: 'Timed review', tasks: ['Work through a timed set and review mistakes.'] },
    ],
  };
}

export async function generateDiagnosticReport({ examType, selectedAnswers, fetcher = null }) {
  if (fetcher) {
    return fetcher({ examType, selectedAnswers });
  }

  return new Promise((resolve, reject) => {
    const timer = typeof window !== 'undefined' ? window.setTimeout : setTimeout;
    timer(() => {
      try {
        resolve(getMockResult(examType, selectedAnswers));
      } catch (error) {
        reject(error);
      }
    }, 700);
  });
}

export function buildReportText(examType, result) {
  const strengths = result.strengths.length ? result.strengths.join(', ') : 'None';
  const weakAreas = result.weakAreas.length ? result.weakAreas.join(', ') : 'None';
  const planText = result.plan
    .map((day) => `${day.day}: ${day.focus}\n${day.tasks.map((task) => `  • ${task}`).join('\n')}`)
    .join('\n\n');

  return [
    `Exam: ${examType}`,
    `Score: ${result.correctCount} / ${result.total}`,
    `Level: ${result.levelLabel}`,
    `Note: ${result.levelNote}`,
    `Strengths: ${strengths}`,
    `Weak areas: ${weakAreas}`,
    '',
    '7-day study plan:',
    planText,
  ].join('\n');
}
