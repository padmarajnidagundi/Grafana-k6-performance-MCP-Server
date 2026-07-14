import performanceChatMode from "../chatmodes/performance-chatmode.js";
import {
  detectProtocol,
  detectTestType,
  detectUrl,
  formatChecklist,
  inferExamplePath,
  normalizeInput,
} from "./agent-utils.js";

export default function testGenerationAgent(context) {
  const input = normalizeInput(context);

  if (!input) {
    return "Describe the performance test you want to create, including protocol, target URL, and expected traffic pattern.";
  }

  const protocol = detectProtocol(input);
  const testType = detectTestType(input);
  const targetUrl = detectUrl(input);
  const examplePath = inferExamplePath(protocol, testType);
  const checklist = [
    `Protocol: ${protocol}`,
    `Test type: ${testType}`,
    `Starter example: ${examplePath}`,
    targetUrl
      ? `Target URL: ${targetUrl}`
      : "Target URL: provide the system under test",
    "Define thresholds for latency, error rate, and throughput before running the test",
  ];

  const chatModeHint = performanceChatMode({ input });

  return [
    "Performance test plan",
    formatChecklist(checklist),
    `Assistant hint: ${chatModeHint}`,
    "Next step: use the MCP tools to generate or customize a k6 script from the starter example.",
  ].join("\n\n");
}
