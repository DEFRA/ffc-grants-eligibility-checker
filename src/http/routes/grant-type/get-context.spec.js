import { getContext } from './get-context';
import { app } from '../../../config/app.js';

describe('getContext', () => {
  it('should return the correct context object', () => {
    const mockGrantType = {
      id: 'example-grant',
      name: 'Example Grant',
      description: 'This is an example grant'
    };

    const expectedContext = {
      siteTitle: `${app.siteTitle} - example-grant`,
      urlPrefix: `${app.urlPrefix}`,
      showTimeout: true,
      surveyLink: `${app.surveyLink}`,
      sessionTimeoutInMin: `${app.sessionTimeoutInMins}`,
      timeoutPath: `${app.timeoutPath}`,
      cookiesPolicy: {
        confirmed: false,
        analytics: true
      },
      grantType: mockGrantType
    };

    const result = getContext(mockGrantType);
    expect(result).toEqual(expectedContext);
  });
});
