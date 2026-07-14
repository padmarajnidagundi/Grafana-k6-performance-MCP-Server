import http from "k6/http";
import { check, sleep } from "k6";

// Soak test - sustained load over extended period to find memory leaks and degradation
export const options = {
  stages: [
    { duration: "2m", target: 20 }, // Ramp up to moderate load
    { duration: "30m", target: 20 }, // Sustained load for extended period
    { duration: "2m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // 95% of requests should be below 1.5s
    http_req_failed: ["rate<0.01"], // Error rate should be below 1%
    http_reqs: ["rate>10"], // Should handle at least 10 requests/sec
  },
};

export default function () {
  const res = http.get("https://test.k6.io");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 1500ms": (r) => r.timings.duration < 1500,
  });

  sleep(1);
}

// Handle test setup
export function setup() {
  console.log(
    "Starting soak test to identify memory leaks and performance degradation...",
  );
  console.log("This test will run for ~34 minutes");
}

// Handle test teardown
export function teardown(data) {
  console.log("Soak test completed. Review metrics for degradation over time.");
}
