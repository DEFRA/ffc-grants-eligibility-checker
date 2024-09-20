const { Given } = require("@wdio/cucumber-framework");
const { browser } = require("@wdio/globals");

Given(/^the user navigates to "([^"]*)?"$/, async (page) => {
    await browser.url(page);
});

Given(/^completes any login process/, async () => {
    const currentUrl = await browser.getUrl();
    if (currentUrl.endsWith("login")) {
        await $("//input[@id='username']").setValue(process.env.LOGIN_USERNAME);
        await $("//input[@id='password']").setValue(process.env.LOGIN_PASSWORD);
        await $("//button[@type='submit']").click();
    }
});
