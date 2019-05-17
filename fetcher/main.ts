import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

const README_PATH = './README.md';

console.log('👙 开始初始化爬虫环境...');

console.log('💯 获取readme中的medium链接...');
let readme = fs.readFileSync(README_PATH)
    .toString();

let urls = readme.match(/https:\/\/blog\.angularindepth\.com\/[\w-]+/g);

console.log('🍮 获取所有已下载的文件...');
// 读取 pdf 文件夹，取得所有不带后缀的文件名
let articles = fs.readdirSync('./pdf')
    .map(article => article.substr(0, article.indexOf('.')));

console.log('🍫 获取需要下载的链接...');
let downloads = urls.filter(url =>
    !articles.some(article => url.includes(article)));

let filePath = (download) => {
    let fileName = /https:\/\/blog\.angularindepth\.com\/([\w-]+)-(\w+)/.exec(download)[1];
    return `./pdf/${fileName}.pdf`;
};

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        for(let i = 0; i < downloads.length; i++) {
            console.log(`☕ 开始下载[${downloads[i]}]...`);

            await page.goto(downloads[i]);

            await page.pdf({ path: filePath(downloads[i]), format: 'A4' });

            console.log(`✅ 下载成功!`);

            readme = readme.replace(`(${downloads[i]})`, `(${downloads[i]})([pdf](${filePath(downloads[i])}))`);
        }
    } catch(e) {
        console.error('❌ 出错啦:', e);
    }

    // 覆盖readme文件
    fs.writeFileSync(README_PATH, readme);

    console.log(`🔨 本次爬爬结束`);
    await browser.close();
})();