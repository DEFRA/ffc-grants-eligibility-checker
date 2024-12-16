import { Then } from '@wdio/cucumber-framework';
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
