import { $, browser, expect } from '@wdio/globals';
import AxeBuilder from '@axe-core/webdriverio';
import fs from 'node:fs/promises';

describe('Example Grant Journey', () => {
  it('should meet accessibility standards', async () => {
    await browser.url('eligibility-checker/example-grant/start');

    // start
    await analyzeAccessibility();
    await $(`//*[contains(text(),'Start now')]`).click();

    // country
    await analyzeAccessibility();
    await $(`//input[contains(@value,'Yes')]`).click();
    await $(`//button[@id='Continue']`).click();

    // consent
    await analyzeAccessibility();
    await $(`//button[@id='btnConfirmSend']`).click();

    // confirmation
    await analyzeAccessibility();
  });
});

async function analyzeAccessibility() {
  const results = await new AxeBuilder({ client: browser })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const path = (await browser.getUrl()).split('/').pop();
  await fs.writeFile(`/json-reports/example-grant/${path}.json`, JSON.stringify(results, null, 4));
  expect(results.violations.length).toBe(0);
}
