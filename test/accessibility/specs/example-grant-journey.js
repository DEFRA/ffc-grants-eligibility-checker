import { $, browser, expect } from '@wdio/globals';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'node:fs/promises';

describe('Example Grant Journey', () => {
  it('should meet accessibility standards', async () => {
    await browser.url('eligibility-checker/example-grant/start');

    // start
    let hasViolations = await analyzeAccessibility();
    await $(`//*[contains(text(),'Start now')]`).click();

    // country
    hasViolations = hasViolations || (await analyzeAccessibility());
    await $(`//input[contains(@value,'Yes')]`).click();
    await $(`//button[@id='Continue']`).click();

    // consent
    hasViolations = hasViolations || (await analyzeAccessibility());
    await $(`//button[@id='btnConfirmSend']`).click();

    // confirmation
    hasViolations = hasViolations || (await analyzeAccessibility());

    expect(hasViolations).toBe(false);
  });
});

/**
 * Analyzes accessibility and writes axe report
 * @returns {object} - Boolean indicated if violations were found
 */
async function analyzeAccessibility() {
  const results = await new AxeBuilder({ client: browser })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const urlParts = (await browser.getUrl()).split('/');
  let page = urlParts.pop();
  if (await $(`//div[@class='govuk-error-summary']`).isDisplayed()) {
    page = `${page}-error`;
  }
  const grantName = urlParts.pop();

  fs.ensureDirSync(path.resolve('test-output', 'axe-reports', grantName));
  jsonFile.writeFileSync(
    path.resolve(`${'test-output'}/axe-reports/${grantName}`, `${page}.json`),
    results,
    { spaces: 4 }
  );

  return results.violations.length > 0;
}
