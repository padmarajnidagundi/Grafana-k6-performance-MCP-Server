// scenario-builder-agent.js
// Detects user journey steps from a natural-language description and
// returns a k6 group()-based scenario structure with configuration hints.

import {
  detectProtocol,
  detectTestType,
  detectUrl,
  formatChecklist,
  normalizeInput,
} from "./agent-utils.js";

const STEP_KEYWORDS = {
  login: ["login", "auth", "sign in", "authenticate"],
  browse: ["browse", "search", "list", "catalog", "explore"],
  view: ["view", "detail", "product", "item", "profile"],
  add: ["add", "cart", "basket", "select"],
  checkout: ["checkout", "purchase", "buy", "order", "payment"],
  logout: ["logout", "sign out", "logoff"],
  upload: ["upload", "submit", "create", "post"],
  download: ["download", "export", "fetch"],
};

function detectSteps(input) {
  return Object.entries(STEP_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => input.includes(kw)))
    .map(([step]) => step);
}

export default function scenarioBuilderAgent(context) {
  const input = normalizeInput(context);

  if (!input) {
    return "Describe the user journey you want to simulate (e.g., 'user logs in, browses catalog, adds to cart, and checks out').";
  }

  const steps = detectSteps(input);
  const protocol = detectProtocol(input);
  const testType = detectTestType(input);
  const targetUrl = detectUrl(input);

  if (steps.length === 0) {
    steps.push("request");
  }

  const scenarioChecklist = steps.map((step, i) => `Step ${i + 1}: ${step}`);

  const hints = [
    `Protocol: ${protocol}`,
    targetUrl
      ? `Base URL: ${targetUrl}`
      : "Base URL: specify the system under test",
    `Traffic profile: ${testType}`,
    `Detected ${steps.length} step(s) in the user journey`,
    "Group each step using k6 `group()` blocks to isolate latency per action",
    "Add a `sleep(1)` between steps to simulate realistic think time",
    "Define per-group thresholds to catch step-specific regressions",
  ];

  const groupLines = steps.flatMap((step) => [
    `  group('${step}', () => {`,
    `    // implement ${step} requests here`,
    "  });",
    "  sleep(1);",
  ]);

  const groupSnippet = [
    "k6 scenario structure",
    "```js",
    "import { group, sleep } from 'k6';",
    "",
    "export default function () {",
    ...groupLines,
    "}",
    "```",
  ].join("\n");

  return [
    "Scenario plan",
    formatChecklist(scenarioChecklist),
    "Configuration hints",
    formatChecklist(hints),
    groupSnippet,
    "Next step: implement each group block using the relevant MCP tool or starter example.",
  ].join("\n\n");
}
