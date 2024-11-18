import { Then } from '@wdio/cucumber-framework';

Then(/^(?:the user should|should) see heading "([^"]*)?"$/, async (text) => {
  if (text.indexOf("'") > -1) {
    text = text.substring(0, text.indexOf("'"));
  }
  await expect($(`//h1[contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) be at URL "([^"]*)?"$/, async (urlPath) => {
  const fullUrl = await browser.getUrl();
  await expect(fullUrl.endsWith(urlPath)).toBe(true);
});

Then(/^(?:the user should|should) see a reference number for their application$/, async () => {
  await expect($(`//*[@data-testid='reference-number']`)).toHaveText(/[A-Z]{2}-[0-9]{3}-[0-9]{3}/);
});
