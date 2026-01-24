import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike test - sudden increase in traffic
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Normal load
    { duration: '30s', target: 100 },  // Sudden spike!
    { duration: '30s', target: 100 },  // Sustained spike
    { duration: '10s', target: 10 },   // Return to normal
    { duration: '10s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // More lenient for spike testing
    http_req_failed: ['rate<0.15'],    // Allow slightly higher error rate
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
