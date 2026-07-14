import { formatChecklist, normalizeInput } from "./agent-utils.js";

function extractMetric(input, name) {
  const regex = new RegExp(`${name}[^\d]*(\\d+(?:\\.\\d+)?)`, "i");
  const match = input.match(regex);
  return match ? Number(match[1]) : null;
}

export default function resultAnalysisAgent(context) {
  const input = normalizeInput(context);
  const p95 = extractMetric(input, "p95");
  const errorRate = extractMetric(input, "error rate");
  const rps = extractMetric(input, "rps");

  if (!input) {
    return "Provide a k6 result summary or paste key metrics such as p95 latency, error rate, and throughput.";
  }

  const findings = [];

  if (p95 !== null) {
    findings.push(
      p95 > 1000
        ? `p95 latency is elevated at ${p95} ms`
        : `p95 latency is within a reasonable range at ${p95} ms`,
    );
  }

  if (errorRate !== null) {
    findings.push(
      errorRate > 1
        ? `error rate is high at ${errorRate}%`
        : `error rate is controlled at ${errorRate}%`,
    );
  }

  if (rps !== null) {
    findings.push(`observed throughput is ${rps} requests per second`);
  }

  if (findings.length === 0) {
    findings.push(
      "No structured metrics were detected, so the analysis should start with response time percentiles, failure rate, and request volume.",
    );
  }

  const actions = [
    "Compare latency percentiles against your SLO or threshold values",
    "Break down failures by endpoint, protocol operation, or scenario",
    "Rerun with a ramping profile if saturation behavior is unclear",
  ];

  return [
    "k6 result analysis",
    formatChecklist(findings),
    "Recommended next actions",
    formatChecklist(actions),
  ].join("\n\n");
}
