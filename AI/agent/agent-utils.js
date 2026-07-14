const TEST_TYPE_KEYWORDS = {
  smoke: ["smoke"],
  load: ["load", "baseline"],
  stress: ["stress"],
  spike: ["spike", "surge"],
  soak: ["soak", "endurance", "longevity"],
  ramping: ["ramping", "ramp"],
};

const PROTOCOL_KEYWORDS = {
  graphql: ["graphql"],
  grpc: ["grpc"],
  websocket: ["websocket", "web socket", "ws"],
  browser: ["browser", "ui test", "chromium", "headless"],
  http: ["http", "https", "rest", "api"],
};

export function normalizeInput(context) {
  return (context?.input || "").trim().toLowerCase();
}

export function findKeywordMatch(input, lookup) {
  for (const [name, keywords] of Object.entries(lookup)) {
    if (keywords.some((keyword) => input.includes(keyword))) {
      return name;
    }
  }

  return null;
}

export function detectTestType(input) {
  return findKeywordMatch(input, TEST_TYPE_KEYWORDS) || "load";
}

export function detectProtocol(input) {
  return findKeywordMatch(input, PROTOCOL_KEYWORDS) || "http";
}

export function inferExamplePath(protocol, testType) {
  if (protocol === "graphql") {
    return "tests/graphql/graphql-test.js";
  }

  if (protocol === "grpc") {
    return "tests/grpc/grpc-test.js";
  }

  if (protocol === "websocket") {
    return "tests/websocket/websocket-test.js";
  }

  if (protocol === "browser") {
    return "tests/browser/browser-test.js";
  }

  const httpExamples = {
    smoke: "tests/smoke/smoke-test.js",
    load: "tests/load/basic-load-test.js",
    stress: "tests/stress/stress-test.js",
    spike: "tests/spike/spike-test.js",
    soak: "tests/soak/soak-test.js",
    ramping: "tests/ramping/ramping-vus-test.js",
  };

  return httpExamples[testType] || httpExamples.load;
}

export function detectUrl(input) {
  const urlMatch = input.match(/https?:\/\/\S+/);
  return urlMatch ? urlMatch[0] : null;
}

export function formatChecklist(items) {
  return items.map((item) => `- ${item}`).join("\n");
}
