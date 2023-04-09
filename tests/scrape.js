const { Builder, By, Key, until,runTests } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

(async function runTests() {
  // set up options to enable browser network logging
  const options = new chrome.Options();
  options.setLoggingPrefs({
    performance: 'ALL',
    browser: 'ALL'
  });

  // set up driver and navigate to website
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.get('https://www.lambdatest.com/');

  // click on each header navigation item
  const headerLinks = await driver.findElements(By.css('.navbar-nav > li > a'));

  // click on each header navigation item
  for (let i = 0; i < headerLinks.length; i++) {
    await headerLinks[i].click();
    await driver.wait(until.urlContains('#'), 10000);
  }

  // capture and store network logs
  const logs = await driver.manage().logs().get('performance');
  fs.writeFileSync('logs.json', JSON.stringify(logs));

  // repeat process for more than 100 tests
  for (let i = 1; i <= 100; i++) {
    await driver.get('https://www.lambdatest.com/');

    const headerLinks = await driver.findElements(By.css('.navbar-nav > li > a'));

    for (let i = 0; i < headerLinks.length; i++) {
      await headerLinks[i].click();
      await driver.wait(until.urlContains('#'), 10000);
    }

    const logs = await driver.manage().logs().get('performance');
    fs.writeFileSync(`logs_${i}.json`, JSON.stringify(logs));
  }

  // quit driver
  await driver.quit();
})();
