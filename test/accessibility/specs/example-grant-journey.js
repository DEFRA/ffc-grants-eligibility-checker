import { $, browser, expect } from '@wdio/globals';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'fs-extra';
import jsonFile from 'jsonfile';
import path from 'node:path';

describe('Example Grant journey', () => {
  it('should meet accessibility standards', async () => {
    const analyzeAccessibility = async function () {
      const results = await new AxeBuilder({ client: browser })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const urlParts = (await browser.getUrl()).split('/');
      let page = urlParts.pop();
      if (await $(`//div[@class='govuk-error-summary']`).isDisplayed()) {
        page = `${page}-error`;
      }
      const grantName = urlParts.pop();

      fs.ensureDirSync(path.resolve('/home/node/test-output', 'axe-reports', grantName));
      jsonFile.writeFileSync(
        path.resolve(`/home/node/test-output/axe-reports/${grantName}`, `${page}.json`),
        results,
        { spaces: 4 }
      );

      if (results.violations.length > 0) {
        hasViolations = true;
      }
    };

    let hasViolations = false;
    await browser.url('eligibility-checker/example-grant/start');

    // start
    await analyzeAccessibility();
    await $(`//*[contains(text(),'Start now')]`).click();

    // country
    await analyzeAccessibility();
    await $(`//button[@id='Continue']`).click();

    // country error
    await analyzeAccessibility();
    await $(`//input[contains(@value,'Yes')]`).click();
    await $(`//button[@id='Continue']`).click();

    // consent
    await analyzeAccessibility();
    await $(`//button[@id='btnConfirmSend']`).click();

    // confirmation
    await analyzeAccessibility();

    expect(hasViolations).toBe(false);
  });
});
