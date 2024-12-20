import { $, browser, expect } from '@wdio/globals';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'fs-extra';
import jsonFile from 'jsonfile';
import path from 'node:path';
import { functionRetrier } from '../utils/functionRetrier.js';

describe('Example Grant journey', () => {
  it('should meet accessibility standards', async () => {
    /**
     * Analyzes the current browser page for accessibility issues.
     */
    async function analyzeAccessibility() {
      const success = await functionRetrier(callAxeAndWriteResults);
      testFailed = testFailed || !success;
    }

    let testFailed = false;

    // start
    await browser.url('eligibility-checker/example-grant/start');
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

    expect(testFailed).toBe(false);
  });

  /**
   * Calls axe-core, analyzes the current browser page and writes the results to a JSON file.
   * @returns {boolean} True if Axe analysis was successful, false if accessibility violations were found.
   */
  async function callAxeAndWriteResults() {
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

    return results.violations.length === 0;
  }
});
