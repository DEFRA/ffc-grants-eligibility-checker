import { Then } from '@wdio/cucumber-framework';

Then(/^(?:the user should|should) see heading "([^"]*)?"$/, async (text) => {
  await browser.saveScreenshot('./screenshot.png');
  if (text.indexOf("'") > -1) {
    text = text.substring(0, text.indexOf("'"));
  }
  await expect($(`//h1[contains(text(),"${text}")]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) be at URL "([^"]*)?"$/, async (urlPath) => {
  const fullUrl = await browser.getUrl();
  await expect(fullUrl.endsWith(urlPath)).toBe(true);
});
