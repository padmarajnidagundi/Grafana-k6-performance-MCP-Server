// Example: HTTP Skill
// This skill can be imported and used by agents to make HTTP requests.

import http from 'k6/http';

export function getRequest(url) {
  return http.get(url);
}
