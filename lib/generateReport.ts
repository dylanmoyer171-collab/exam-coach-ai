import { gradeDiagnostic, type DiagnosticExamType, type DiagnosticResult } from "./diagnostic-data";

type GenerateReportArgs = {
  examType: DiagnosticExamType;
  selectedAnswers: Record<string, string>;
  fetcher?: (args: GenerateReportArgs) => Promise<DiagnosticResult> | DiagnosticResult;
};

export async function generateDiagnosticReport({ examType, selectedAnswers, fetcher }: GenerateReportArgs): Promise<DiagnosticResult> {
  if (fetcher) {
    return fetcher({ examType, selectedAnswers });
  }

  return new Promise((resolve, reject) => {
    const timer = typeof window !== "undefined" ? window.setTimeout : setTimeout;
    timer(() => {
      try {
        resolve(gradeDiagnostic(examType, selectedAnswers));
      } catch (error) {
        reject(error);
      }
    }, 700);
  });
}

export function buildReportText(examType: DiagnosticExamType, result: DiagnosticResult): string {
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
