// Example: Performance Testing Chat Mode
// This script demonstrates a chat mode for k6 performance testing assistance.

export default function chatMode(context) {
  const input = context.input.toLowerCase();

  if (input.includes("load test") || input.includes("performance test")) {
    return "I can help you with load testing! Would you like to create a basic load test, spike test, or stress test?";
  }

  if (input.includes("spike test")) {
    return "A spike test simulates sudden traffic increases. I can help you set up a spike test with ramping configuration.";
  }

  if (input.includes("metrics") || input.includes("results")) {
    return "k6 provides detailed metrics including response times, throughput, and error rates. Would you like to see an example?";
  }

  if (input.includes("help")) {
    return "I can assist with: load testing, spike testing, metrics analysis, and test configuration. What would you like to know?";
  }

  return "I'm your k6 performance testing assistant. Ask me about load tests, metrics, or testing strategies!";
}
