import http from "k6/http";
import { check, sleep } from "k6";

// Breakpoint test - continuously ramp up load to find the system's breaking point
export const options = {
  stages: [
    { duration: "2m", target: 50 },
    { duration: "2m", target: 100 },
    { duration: "2m", target: 150 },
    { duration: "2m", target: 200 },
    { duration: "2m", target: 250 },
    { duration: "2m", target: 300 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"],
    http_req_failed: ["rate<0.30"],
  },
};

export default function () {
  const res = http.get("https://test.k6.io");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 5000ms": (r) => r.timings.duration < 5000,
  });

  sleep(1);
}

export function setup() {
  console.log(
    "Starting breakpoint test to determine maximum system capacity...",
  );
}

export function teardown(data) {
  console.log(
    "Breakpoint test completed. Analyze results to identify the capacity ceiling.",
  );
}
