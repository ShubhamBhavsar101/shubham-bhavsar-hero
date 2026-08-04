import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '150s',
};

export default function () {
  const params = {
    headers: {
      'Connection': 'keep-alive',
    },
  };
  const res = http.get('http://portfolio.shubham.com/', params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.1);

  // sleep(0.05); // 50ms pause per VU to avoid macOS TCP port exhaustion
}
