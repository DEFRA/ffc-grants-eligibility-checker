import { Given } from '@wdio/cucumber-framework';
import { browser } from '@wdio/globals';

Given(/^the user navigates to "([^"]*)?"$/, async (page) => {
  console.log(`process.env.TEST_ENVIRONMENT_ROOT_URL: ${process.env.TEST_ENVIRONMENT_ROOT_URL}`);
  await browser.url(page);
});
