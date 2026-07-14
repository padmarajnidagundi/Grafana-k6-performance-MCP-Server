// ci-cd-agent.js
// Recommends CI/CD pipeline integration steps for automated k6 testing
// based on the detected platform and test type.

import {
  detectTestType,
  formatChecklist,
  normalizeInput,
} from "./agent-utils.js";

const PLATFORM_KEYWORDS = {
  github: ["github", "github actions", "actions"],
  gitlab: ["gitlab", "gitlab ci"],
  jenkins: ["jenkins"],
  azure: ["azure", "azure devops", "ado"],
  circleci: ["circleci", "circle ci"],
};

function detectPlatform(input) {
  for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
    if (keywords.some((kw) => input.includes(kw))) {
      return platform;
    }
  }
  return "github";
}

const PLATFORM_SNIPPETS = {
  github: `- name: Run k6 Performance Test
  uses: grafana/k6-action@v0.3.1
  with:
    filename: tests/smoke/smoke-test.js`,

  gitlab: `k6-performance:
  image: grafana/k6:latest
  script:
    - k6 run tests/smoke/smoke-test.js`,

  jenkins: `stage('Performance Test') {
  steps {
    sh 'k6 run tests/smoke/smoke-test.js'
  }
}`,

  azure: `- task: Bash@3
  displayName: 'Run k6 Performance Test'
  inputs:
    script: 'k6 run tests/smoke/smoke-test.js'`,

  circleci: `- run:
    name: Run k6 Performance Test
    command: k6 run tests/smoke/smoke-test.js`,
};

export default function ciCdAgent(context) {
  const input = normalizeInput(context);

  if (!input) {
    return "Describe your CI/CD platform and the test type to automate (e.g., 'GitHub Actions smoke test on every pull request').";
  }

  const platform = detectPlatform(input);
  const testType = detectTestType(input);
  const snippet = PLATFORM_SNIPPETS[platform];

  const checklist = [
    `CI/CD platform: ${platform}`,
    `Test type to automate: ${testType}`,
    "Install k6 on the CI runner before the test step",
    "Store test results as pipeline artifacts for audit trails",
    "Fail the pipeline when k6 thresholds are exceeded (exit code 99)",
    "Use environment variables to inject target URLs and credentials",
    "Start with a smoke test in CI and promote to load tests on a schedule",
  ];

  return [
    `CI/CD integration — ${platform}`,
    formatChecklist(checklist),
    `Example ${platform} pipeline step`,
    "```yaml",
    snippet,
    "```",
    "Next step: add this snippet to your pipeline file and reference the appropriate test script from `tests/`.",
  ].join("\n\n");
}
