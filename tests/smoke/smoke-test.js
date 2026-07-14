import http from "k6/http";
import { check, sleep } from "k6";

// /Smoke test - minimal load to verify the system is working correctly
export const options = {
  vus: 1,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(99)<1500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://test.k6.io");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 1500ms": (r) => r.timings.duration < 1500,
    "body is not empty": (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}

export function setup() {
  console.log("Starting smoke test to verify basic system functionality...");
}

export function teardown(data) {
  console.log("Smoke test completed. System baseline verified.");
}
