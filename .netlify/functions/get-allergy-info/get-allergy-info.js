const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context, callback) => {
  let location = null;
  let today = null;
  let tomorrow = null;
  let browser = null
  console.log('spawning chrome headless')
  try {
    const executablePath = await chromium.executablePath

    if (!event.queryStringParameters.zip) {
      return {
        statusCode: 500,
        body: "No zip code provided."
      }
    }
    const zip = event.queryStringParameters.zip;

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
    })

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

    location = responseObj.Location;
    today = location.periods.find(period => period.Type === "Today");
    tomorrow = location.periods.find(period => period.Type === "Tomorrow");

  } catch (err) {
    console.log('error', err)
    return callback(null, {
      statusCode: 500,
      body: err.toString()
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      displayLocation: location.DisplayLocation,
      today,
      tomorrow,
    })
  })
};
