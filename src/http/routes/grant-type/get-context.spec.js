import { getContext } from './get-context';
import { appConfig } from '../../../config/app/app-config.js';
import { generateConfirmationId } from '../../../utils/template-utils.js';

describe('getContext', () => {
  it('should return the correct context object', () => {
    const grantTypeId = 'example-grant';

    const expectedContext = {
      showTimeout: true,
      surveyLink: `${appConfig.surveyLink}`,
      sessionTimeoutInMin: `${appConfig.sessionTimeoutInMins}`,
      timeoutPath: `${appConfig.timeoutPath}`,
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
