const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  try {
    if (!event.queryStringParameters.zip) {
      return {
        statusCode: 500,
        body: "No zip code provided."
      }
    }

    const zip = event.queryStringParameters.zip;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let responseObj = null;

    page.on('response', async (response) => {
      if (response.request().url().includes('/api/forecast/current/pollen') && response.request().resourceType().startsWith('xhr')) {
        try {
          responseObj = await response.json()
        } catch (err) {
          console.log(err);
        }
      }
    });

    await page.goto(`https://www.pollen.com/forecast/current/pollen/${zip}`, { waitUntil: 'networkidle0' });
    await browser.close();

    const location = responseObj.Location;
    const today = location.periods.find(period => period.Type === "Today");
    const tomorrow = location.periods.find(period => period.Type === "Tomorrow");

    return {
      statusCode: 200,
      body: JSON.stringify({
        displayLocation: location.DisplayLocation,
        today,
        tomorrow,
      })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
