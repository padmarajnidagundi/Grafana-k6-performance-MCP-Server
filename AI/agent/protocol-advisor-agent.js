import {
  detectProtocol,
  detectTestType,
  formatChecklist,
  inferExamplePath,
  normalizeInput,
} from "./agent-utils.js";

const PROTOCOL_NOTES = {
  http: "Use REST or generic HTTP examples when validating request latency, status codes, and steady-state throughput.",
  graphql:
    "Start from the GraphQL example when query shape, resolver cost, or mutation throughput matter.",
  grpc: "Use the gRPC example when you need unary or streaming RPC validation with protobuf contracts.",
  websocket:
    "Use the WebSocket example when message latency, connection churn, or long-lived sessions are central.",
};

export default function protocolAdvisorAgent(context) {
  const input = normalizeInput(context);
  const protocol = detectProtocol(input);
  const testType = detectTestType(input);
  const examplePath = inferExamplePath(protocol, testType);

  return [
    "Protocol recommendation",
    formatChecklist([
      `Recommended protocol flow: ${protocol}`,
      `Recommended starter example: ${examplePath}`,
      PROTOCOL_NOTES[protocol],
      `Suggested traffic profile: ${testType}`,
    ]),
    "Next step: adapt the referenced example to your endpoint, auth model, payload shape, and thresholds.",
  ].join("\n\n");
}
