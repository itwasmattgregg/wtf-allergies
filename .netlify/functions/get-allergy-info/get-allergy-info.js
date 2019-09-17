const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context, callback) => {
  let location = null;
  let today = null;
  let tomorrow = null;
  let browser = null
  console.log('spawning chrome headless')
  try {
    const executable = await chromium.executablePath
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: executable,
      headless: true,
    })

    const zip = JSON.parse(event.body).zip;

    const page = await browser.newPage();

    let responseObj = null;

    await page.on('response', async (response) => {
      if (response.request().url().includes('/api/forecast/current/pollen') && response.request().resourceType().startsWith('xhr')) {
        try {
          responseObj = await response.json()
        } catch (err) {
          console.log(err);
        }
      }
    });

    await page.goto(`https://www.pollen.com/forecast/current/pollen/${zip}`, { waitUntil: 'networkidle0' });

    location = await responseObj.Location;
    today = await location.periods.find(period => period.Type === "Today");
    tomorrow = await location.periods.find(period => period.Type === "Tomorrow");

  } catch (err) {
    console.log('error', err)
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      })
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
