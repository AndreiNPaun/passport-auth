const puppeteer = require('puppeteer');
const absolutify = require('absolutify');

const proxyController = async (req, res, next) => {
  const { url } = req.query;

  console.log('url', url);

  if (!url) {
    return res.send('No URL provided');
  } else {
    try {
      const browser = await puppeteer.launch({ headless: 'true' });
      const page = await browser.newPage();
      await page.goto(`https://${url}`);

      let document = await page.content();

      console.log('URRL', url);

      // Change this line to handle the full URL
      document = absolutify(
        document,
        `/github-proxy-server?url=${url.split('/')[0]}`
      );

      await browser.close();

      return res.send(document);
    } catch (err) {
      console.log(err);
      return res.send('Error fetching the page');
    }
  }
};

module.exports = { proxyController };
