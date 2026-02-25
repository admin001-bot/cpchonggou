const puppeteer = require('puppeteer');

async function comparePages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 }); // iPhone X size

    // 1. 访问原系统登录页
    console.log('访问原系统登录页...');
    await page.goto('https://sj.lisb-tc.cfd/user/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'C:/Users/Administrator/Desktop/chonggou/screenshots/original_login.png', fullPage: true });
    console.log('原系统登录页截图已保存');

    // 2. 获取原系统HTML和CSS
    const originalHtml = await page.content();
    require('fs').writeFileSync('C:/Users/Administrator/Desktop/chonggou/screenshots/original_login.html', originalHtml);
    console.log('原系统HTML已保存');

    // 3. 访问新系统登录页
    console.log('访问新系统登录页...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'C:/Users/Administrator/Desktop/chonggou/screenshots/new_login.png', fullPage: true });
    console.log('新系统登录页截图已保存');

    // 4. 获取控制台错误
    const newHtml = await page.content();
    require('fs').writeFileSync('C:/Users/Administrator/Desktop/chonggou/screenshots/new_login.html', newHtml);

    console.log('截图对比完成！');

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await browser.close();
  }
}

comparePages();
