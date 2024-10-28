import { getContext } from './get-context';
import { app } from '../../../config/app.js';

describe('getContext', () => {
  it('should return the correct context object', () => {
    const grantTypeId = 'example-grant';

    const expectedContext = {
      siteTitle: `${app.siteTitle} - example-grant`,
      showTimeout: true,
      surveyLink: `${app.surveyLink}`,
      sessionTimeoutInMin: `${app.sessionTimeoutInMins}`,
      timeoutPath: `${app.timeoutPath}`,
      cookiesPolicy: {
        confirmed: false,
        analytics: true
      },
      meta: {
        currentPageId: 'example-grant',
        previousPageId: 'previous-page',
        nextPageId: 'next-page',
        grantTypeId: 'example-grant'
      }
    };

    const meta = {
      currentPageId: 'example-grant',
      previousPageId: 'previous-page',
      nextPageId: 'next-page'
    };

    const result = getContext(grantTypeId, meta);
    expect(result).toEqual(expectedContext);
  });
});
