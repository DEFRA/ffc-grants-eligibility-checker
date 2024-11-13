import { Then } from '@wdio/cucumber-framework';

Then(/^(?:the user should|should) see heading "([^"]*)?"$/, async (text) => {
  console.log(`Expecting heading: ${text}, actual heading: ${await $(`//h1`).getText()}`);
  if (text.indexOf("'") > -1) {
    text = text.substring(0, text.indexOf("'"));
  }
  await expect($(`//h1[contains(text(),"${text}")]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) be at URL "([^"]*)?"$/, async (urlPath) => {
  const fullUrl = await browser.getUrl();
  await expect(fullUrl.endsWith(urlPath)).toBe(true);
});
