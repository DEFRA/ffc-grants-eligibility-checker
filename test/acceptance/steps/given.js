import { Given } from '@wdio/cucumber-framework';
import { browser } from '@wdio/globals';

Given(/^the user navigates to "([^"]*)?"$/, async (page) => {
  await browser.url(page);
});
