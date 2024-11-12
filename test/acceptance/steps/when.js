import { When } from '@wdio/cucumber-framework';

When(/^(?:the user clicks|clicks) on "([^"]*)?"$/, async (text) => {
  await $(`//*[contains(text(),'${text}')]`).click();
});

When(/^the user selects "([^"]*)?"$/, async (text) => {
  const element = await $(`//input[contains(@value,'${text}')]`);
  if (!(await element.isSelected())) {
    await element.click();
  }
});

When(/^(?:the user continues|continues)$/, async () => {
  await $("//button[@id='Continue']").click();
});
