import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Ramping VUs test - gradually increase load
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 VUs
    { duration: '1m', target: 20 },   // Stay at 20 VUs for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'https://test.k6.io';

export default function () {
  group('Homepage', function () {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage has content': (r) => r.body.length > 0,
    });
  });

  sleep(1);

  group('Contact Page', function () {
    const res = http.get(`${BASE_URL}/contacts.php`);
    check(res, {
      'contacts status is 200': (r) => r.status === 200,
    });
  });

  sleep(2);
}
