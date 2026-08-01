import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,          // 50 concurrent virtual users
  duration: '2m',   // Run for 2 minutes
};

export default function () {
  const res = http.get('http://localhost:30080');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}