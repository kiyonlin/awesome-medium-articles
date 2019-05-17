import * as puppeteer from 'puppeteer';

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://blog.angularindepth.com/angulars-digest-is-reborn-in-the-newer-version-of-angular-718a961ebd3e");

    await page.pdf({ path: '../pdf/angulars-digest-is-reborn-in-the-newer-version-of-angular.pdf', format: 'A4' });

    await browser.close();
})();
