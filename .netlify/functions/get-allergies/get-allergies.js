const curl = new (require( 'curl-request' ))();

exports.handler = async function(event, context) {
  try {
    const {zip} = JSON.parse(event.body);
    const response = await curl.setHeaders([
        `referer: https://www.pollen.com/forecast/current/pollen/${zip}`
    ])
    .get(`https://www.pollen.com/api/forecast/current/pollen/${zip}`)
    .then(({statusCode, body, headers}) => {
        console.log(statusCode, body, headers)
        return body;
    })
    .catch((e) => {
        return e;
    });

    return {
      statusCode: 200,
      body: response
    }
  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message })
    }
  }
}
