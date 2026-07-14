import http from "k6/http";
import { check, sleep } from "k6";

// Stress test - gradually increase load beyond normal capacity
export const options = {
  stages: [
    { duration: "2m", target: 20 }, // Ramp up to normal load
    { duration: "5m", target: 20 }, // Stay at normal load
    { duration: "2m", target: 50 }, // Increase to above-normal load
    { duration: "5m", target: 50 }, // Stay at above-normal load
    { duration: "2m", target: 100 }, // Increase to stress load
    { duration: "5m", target: 100 }, // Stay at stress load
    { duration: "2m", target: 150 }, // Increase to breaking point
    { duration: "5m", target: 150 }, // Sustain breaking point
    { duration: "5m", target: 0 }, // Ramp down to recovery
  ],
  thresholds: {
    http_req_duration: ["p(95)<3000"], // Lenient threshold for stress testing
    http_req_failed: ["rate<0.20"], // Allow up to 20% failure rate
  },
};

export default function () {
  const res = http.get("https://test.k6.io");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 3000ms": (r) => r.timings.duration < 3000,
  });

  sleep(1);
}

// Handle test setup
export function setup() {
  console.log("Starting stress test to find system breaking point...");
}

// Handle test teardown
export function teardown(data) {
  console.log(
    "Stress test completed. Review results to identify breaking point.",
  );
}
