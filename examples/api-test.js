import http from 'k6/http';
import { check } from 'k6';

// API performance test with authentication
export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(99)<1500'],
    'http_req_duration{endpoint:users}': ['p(95)<800'],
    'http_req_duration{endpoint:posts}': ['p(95)<800'],
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  // Test GET endpoint
  let res = http.get(`${BASE_URL}/users/1`, {
    tags: { endpoint: 'users' },
  });
  check(res, {
    'GET user status is 200': (r) => r.status === 200,
    'user has id': (r) => JSON.parse(r.body).id !== undefined,
  });

  // Test POST endpoint
  const payload = JSON.stringify({
    title: 'k6 Performance Test',
    body: 'Testing POST request',
    userId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: { endpoint: 'posts' },
  };

  res = http.post(`${BASE_URL}/posts`, payload, params);
  check(res, {
    'POST status is 201': (r) => r.status === 201,
    'response has id': (r) => JSON.parse(r.body).id !== undefined,
  });

  // Test PUT endpoint
  res = http.put(`${BASE_URL}/posts/1`, payload, params);
  check(res, {
    'PUT status is 200': (r) => r.status === 200,
  });

  // Test DELETE endpoint
  res = http.del(`${BASE_URL}/posts/1`);
  check(res, {
    'DELETE status is 200': (r) => r.status === 200,
  });
}
