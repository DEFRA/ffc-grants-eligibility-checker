import { Then } from '@wdio/cucumber-framework';
import { $, browser, expect } from '@wdio/globals';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'node:fs/promises';
import poller from '../services/poller.js';

Then(/^(?:the user should|should) see heading "([^"]*)?"$/, async (text) => {
  if (text.indexOf("'") > -1) {
    text = text.substring(0, text.indexOf("'"));
  }
  await expect($(`//h1[contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) be at URL "([^"]*)?"$/, async (expectedPath) => {
  const doesActualUrlEndWithExpectedPath = await poller.pollForSuccess(async () => {
    const actualUrl = await browser.getUrl();
    return await actualUrl.endsWith(expectedPath);
  });
  await expect(doesActualUrlEndWithExpectedPath).toBe(true);
});

Then(/^(?:the user should|should) see a reference number for their application$/, async () => {
  await expect($(`//*[@data-testid='reference-number']`)).toHaveText(/[A-Z]{2}-[0-9]{3}-[0-9]{3}/);
});

Then(/^(?:the user should|should) see error "([^"]*)?"$/, async (text) => {
  await expect(
    $(`//div[@class='govuk-error-summary']//a[contains(text(),'${text}')]`)
  ).toBeDisplayed();
});

Then(/^(?:the user completes|completes) the journey$/, async () => {
  // complete the journey from the country page to reset session state
  await $(`//input[contains(@value,'Yes')]`).click();
  await $(`//button[@id='Continue']`).click();
  await $(`//button[@id='btnConfirmSend']`).click();
});

Then(/^the page should meet accessibility standards$/, async () => {
  const results = await new AxeBuilder({ client: browser })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  let path = (await browser.getUrl()).split('/').pop();
  if (await $(`//div[@class='govuk-error-summary']`).isDisplayed()) {
    path = `${path}-validation`;
  }

  await fs.writeFile(
    `${process.env.RUNNING_IN_CONTAINER ? '/json-reports' : './json-reports'}/example-grant/${path}.json`,
    JSON.stringify(results, null, 4)
  );
  await expect(results.violations.length).toBe(0);
});
