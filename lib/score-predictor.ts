// Score prediction algorithm

export interface ScorePrediction {
  estimatedGain: number;
  estimatedFinalScore: number;
  likelihood: number;
  likelihood_label: "Very Likely" | "Likely" | "Challenging" | "Unrealistic";
  mainReason: string;
  warning?: string;
  encouragement?: string;
}

export function predictScore(
  examType: string,
  currentScore: number,
  targetScore: number,
  testDate: string | null,
  hoursPerWeek: number,
  weakAreaCount: number,
  maxScore: number
): ScorePrediction {
  // Calculate weeks until test
  let weeksUntilTest = 4;
  if (testDate) {
    const now = new Date();
    const exam = new Date(testDate);
    const diffMs = exam.getTime() - now.getTime();
    weeksUntilTest = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)));
  }

  // Total available study hours
  const totalHours = hoursPerWeek * weeksUntilTest;

  // Calculate score gain potential
  const scoreGap = targetScore - currentScore;

  if (scoreGap <= 0) {
    return {
      estimatedGain: 0,
      estimatedFinalScore: currentScore,
      likelihood: 95,
      likelihood_label: "Very Likely",
      mainReason: "Your current score already meets or exceeds your target.",
      encouragement:
        "Focus on maintaining your skills and preventing score drop on test day.",
    };
  }

  // Factor 1: Time availability (hours needed to improve score)
  const improvementPerHour = 0.5; // rough estimate: 0.5 points per hour of effective study
  const potentialGainFromTime = totalHours * improvementPerHour;

  // Factor 2: Number of weak areas (more areas = harder to improve)
  const weakAreaPenalty = weakAreaCount > 0 ? 1 - weakAreaCount * 0.15 : 1;

  // Factor 3: Score gap size (bigger gaps are harder to close)
  const gapDifficulty = Math.max(0.3, 1 - scoreGap / (maxScore * 0.5));

  // Factor 4: Starting score (higher starting score = harder to improve)
  const startingScoreMultiplier = currentScore > maxScore * 0.8 ? 0.6 : 1;

  // Factor 5: Time before test (more time = better chance)
  const timeMultiplier = weeksUntilTest >= 8 ? 1 : weeksUntilTest >= 4 ? 0.9 : 0.7;

  // Calculate realistic gain
  const realisticGain = Math.min(
    scoreGap,
    potentialGainFromTime *
      weakAreaPenalty *
      gapDifficulty *
      startingScoreMultiplier *
      timeMultiplier
  );

  const estimatedFinalScore = currentScore + realisticGain;

  // Calculate likelihood percentage
  let likelihood = 50;

  if (realisticGain >= scoreGap * 0.95) {
    likelihood = 85;
  } else if (realisticGain >= scoreGap * 0.8) {
    likelihood = 75;
  } else if (realisticGain >= scoreGap * 0.6) {
    likelihood = 60;
  } else if (realisticGain >= scoreGap * 0.4) {
    likelihood = 45;
  } else {
    likelihood = 30;
  }

  // Adjust likelihood based on study hours
  if (hoursPerWeek < 5) {
    likelihood = Math.max(20, likelihood - 15);
  } else if (hoursPerWeek > 12) {
    likelihood = Math.min(90, likelihood + 10);
  }

  // Determine likelihood label
  let likelihood_label: "Very Likely" | "Likely" | "Challenging" | "Unrealistic";
  if (likelihood >= 75) {
    likelihood_label = "Very Likely";
  } else if (likelihood >= 55) {
    likelihood_label = "Likely";
  } else if (likelihood >= 35) {
    likelihood_label = "Challenging";
  } else {
    likelihood_label = "Unrealistic";
  }

  // Generate reason and warnings
  let mainReason = "";
  let warning: string | undefined;
  let encouragement: string | undefined;

  if (likelihood_label === "Very Likely") {
    mainReason =
      hoursPerWeek >= 10
        ? `With ${hoursPerWeek} hours/week and focused effort on your weak areas, reaching ${targetScore} is very achievable.`
        : `Your study plan is solid. Consistent practice should get you to ${targetScore}.`;
    encouragement = `You're on track! Stick to your weekly plan and stay focused on weak areas.`;
  } else if (likelihood_label === "Likely") {
    mainReason = `With ${hoursPerWeek} hours/week, you should see meaningful progress toward ${targetScore}.`;
    if (scoreGap > 200) {
      warning = `Your target is ambitious. Consider dedicating more hours per week or extending your study timeline.`;
    }
    encouragement = `This is achievable with consistent effort and smart prioritization.`;
  } else if (likelihood_label === "Challenging") {
    mainReason = `Reaching ${targetScore} will require intensive study and perfect execution.`;
    warning = `Consider extending your study timeline or adjusting your target score. A jump of ${scoreGap} points is significant.`;
    encouragement = `Don't get discouraged. Even if you don't hit ${targetScore}, you will improve significantly.`;
  } else {
    mainReason = `Reaching ${targetScore} is unlikely with ${hoursPerWeek} hours/week over ${weeksUntilTest} weeks.`;
    warning = `Your goal requires either more study time or a longer timeline. Consider studying ${Math.ceil((scoreGap / 100) * hoursPerWeek)} more hours per week or extending your prep by several weeks.`;
    encouragement = `Don't give up! A more realistic target might be ${Math.min(targetScore, currentScore + Math.ceil(scoreGap * 0.6))}.`;
  }

  return {
    estimatedGain: Math.round(realisticGain),
    estimatedFinalScore: Math.round(estimatedFinalScore),
    likelihood: Math.round(likelihood),
    likelihood_label,
    mainReason,
    warning,
    encouragement,
  };
}

// SAT-specific predictor (1600 scale)
export function predictSATScore(
  currentScore: number,
  targetScore: number,
  testDate: string | null,
  hoursPerWeek: number,
  weakAreaCount: number
): ScorePrediction {
  return predictScore("SAT", currentScore, targetScore, testDate, hoursPerWeek, weakAreaCount, 1600);
}

// ACT-specific predictor (36 scale)
export function predictACTScore(
  currentScore: number,
  targetScore: number,
  testDate: string | null,
  hoursPerWeek: number,
  weakAreaCount: number
): ScorePrediction {
  return predictScore("ACT", currentScore, targetScore, testDate, hoursPerWeek, weakAreaCount, 36);
}

// AP-specific predictor (5 scale)
export function predictAPScore(
  currentScore: number,
  targetScore: number,
  testDate: string | null,
  hoursPerWeek: number,
  weakAreaCount: number
): ScorePrediction {
  return predictScore("AP", currentScore, targetScore, testDate, hoursPerWeek, weakAreaCount, 5);
}
