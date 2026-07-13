import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDiagnosticReport } from './generateReport.mjs';

test('generateDiagnosticReport returns a mock report for a completed diagnostic', async () => {
  const report = await generateDiagnosticReport({
    examType: 'SAT',
    selectedAnswers: {
      'sat-algebra': '5',
      'sat-reading': 'a source of shared strength',
      'sat-grammar': 'will have made',
      'sat-data': '$1000',
      'sat-timing': 'Spend 45 seconds per question and review only if time remains',
    },
  });

  assert.equal(report.correctCount, 5);
  assert.equal(report.total, 5);
  assert.equal(report.levelLabel, 'Strong');
});

test('generateDiagnosticReport can use a custom fetcher', async () => {
  const report = await generateDiagnosticReport({
    examType: 'ACT',
    selectedAnswers: {},
    fetcher: async () => ({ mock: true }),
  });

  assert.deepEqual(report, { mock: true });
});
