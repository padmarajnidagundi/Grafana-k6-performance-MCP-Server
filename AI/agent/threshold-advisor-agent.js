// threshold-advisor-agent.js
// Recommends k6 threshold values (p95 latency, error rate, throughput)
// based on the detected test type and protocol.

import {
  detectProtocol,
  detectTestType,
  formatChecklist,
  normalizeInput,
} from "./agent-utils.js";

const TEST_TYPE_THRESHOLDS = {
  smoke: {
    p95: 200,
    errorRate: 0.01,
    rpsNote: "Low RPS expected — smoke tests use 1–2 VUs",
  },
  load: {
    p95: 500,
    errorRate: 1,
    rpsNote: "Measure sustained RPS under steady-state load",
  },
  stress: {
    p95: 1000,
    errorRate: 5,
    rpsNote: "Track RPS degradation as load increases toward saturation",
  },
  spike: {
    p95: 800,
    errorRate: 2,
    rpsNote: "Watch for RPS drops during the surge window",
  },
  soak: {
    p95: 600,
    errorRate: 1,
    rpsNote: "Monitor for RPS drift and memory-related slowdown over time",
  },
  ramping: {
    p95: 500,
    errorRate: 1,
    rpsNote: "RPS should scale linearly — flag plateaus or drops",
  },
};

export default function thresholdAdvisorAgent(context) {
  const input = normalizeInput(context);

  if (!input) {
    return "Describe the test type and service tier to receive threshold recommendations (e.g., 'stress test for a payment API').";
  }

  const testType = detectTestType(input);
  const protocol = detectProtocol(input);
  const t = TEST_TYPE_THRESHOLDS[testType] || TEST_TYPE_THRESHOLDS.load;

  const checklist = [
    `Test type: ${testType}`,
    `Protocol: ${protocol}`,
    `Recommended p95 latency threshold: < ${t.p95} ms`,
    `Recommended error rate threshold: < ${t.errorRate}%`,
    `Throughput guidance: ${t.rpsNote}`,
    "Adjust these values to match your SLO agreements before running the test",
  ];

  const k6Snippet = [
    "k6 threshold configuration",
    "```js",
    "export const options = {",
    "  thresholds: {",
    `    http_req_duration: ['p(95)<${t.p95}'],`,
    `    http_req_failed: ['rate<${t.errorRate / 100}'],`,
    "  },",
    "};",
    "```",
  ].join("\n");

  return [
    "Threshold recommendations",
    formatChecklist(checklist),
    k6Snippet,
    "Next step: paste these thresholds into your k6 script `options` block, then run the test.",
  ].join("\n\n");
}
