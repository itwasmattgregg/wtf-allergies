const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const {zip} = JSON.parse(event.body);
    // const response = await curl.setHeaders([
    //     `referer: https://www.pollen.com/forecast/current/pollen/${zip}`
    // ])
    // .get(`https://www.pollen.com/api/forecast/current/pollen/${zip}`)
    // .then(({statusCode, body, headers}) => {
    //     console.log(statusCode, body, headers)
    //     return body;
    // })
    // .catch((e) => {
    //     return e;
    // });
    const response = await axios
      .get(`https://www.pollen.com/api/forecast/current/pollen/${zip}`, {
        headers: {
          Referer: `https://www.pollen.com/forecast/current/pollen/${zip}`
        }
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return error;
      });

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }

  } catch(err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message })
    }
  }
}
