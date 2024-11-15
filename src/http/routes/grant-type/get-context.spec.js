import { getContext } from './get-context';
import { app } from '../../../config/app.js';
import { generateConfirmationId } from '../../../utils/template-utils.js';

describe('getContext', () => {
  it('should return the correct context object', () => {
    const grantTypeId = 'example-grant';

    const expectedContext = {
      pageTitle: `${app.siteTitle} - start`,
      showTimeout: true,
      surveyLink: `${app.surveyLink}`,
      sessionTimeoutInMin: `${app.sessionTimeoutInMins}`,
      timeoutPath: `${app.timeoutPath}`,
      cookiesPolicy: {
        confirmed: false,
        analytics: true
      },
      meta: {
        currentPageId: 'start',
        previousPageId: 'previous-page',
        nextPageId: 'next-page',
        grantTypeId: 'example-grant',
        generateConfirmationId
      }
    };

    const meta = {
      currentPageId: 'start',
      previousPageId: 'previous-page',
      nextPageId: 'next-page'
    };

    const result = getContext(grantTypeId, meta);
    expect(result).toEqual(expectedContext);
  });
});
