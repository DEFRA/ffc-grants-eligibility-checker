const { When } = require("@wdio/cucumber-framework");

When(/^(?:the user clicks|clicks) on "([^"]*)?"$/, async (text) => {
    await $(`//*[contains(text(),'${text}')]`).click();
});
