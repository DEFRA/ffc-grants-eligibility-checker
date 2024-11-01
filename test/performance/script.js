/* global __ENV */
import http from 'k6/http';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

export const options = {
  scenarios: {
    journey: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 50 },
        { duration: '25s', target: 50 }
      ],
      gracefulRampDown: '0s',
      gracefulStop: '5s'
    }
  },
  thresholds: {
    http_req_duration: ['p(99)<250'] // 99% of requests should be below 250ms
  }
};

/**
 * Performs the checker journey.
 * This default function is called for every iteration run by k6.
 */
export default function () {
  describe('Checker Journey', (t) => {
    const response = http.get(
      `${__ENV.TEST_ENVIRONMENT_ROOT_URL}/eligibility-checker/example-grant/start`
    );
    expect(response.status).to.equal(200);

    const heading = response.html().find('h1').text();
    expect(heading).to.equal('Generic checker screens');
  });
}
