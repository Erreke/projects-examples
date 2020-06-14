const axios = require('axios');

function getCities(locale, city) {
  return axios.get('http://5.9.41.208/search', {
    params: {
      maxRows: 10,
      username: 'erreke',
      lang: locale,
      type: 'json',
      featureClass: 'P',
      name_startsWith: city,
    },
  })
    .then(response => response.data.geonames.map((item) => {
      const fullName = item.fcode === 'PPLC'
        ? `${item.name} (${item.countryName})`
        : `${item.name} (${item.countryName}, ${item.adminName1})`;

      return {
        name: item.name,
        countryName: item.countryName,
        regionName: item.adminName1,
        fullName,
      };
    }));
}

module.exports = async (req, res) => {
  let status;
  let response;

  try {
    const locale = req.query.locale || null;
    const city = req.query.city || null;

    if (!locale && !city) {
      status = 400;
      response = {
        error: 'ARGUMENTS_NOT_VALID'
      };
    } else {
      const cities = await getCities(locale, city)
  
      if (cities.length) {
        status = 200;
        response = cities;
      } else {
        status = 400;
        response = {
          error: 'CITY_NOT_FOUND'
        };
      }
    } 
  } 
  catch (error) {
    console.error(error);

    status = 400;
    response = {
      success: false,
      errors: [error.message]
    };
  }

  res.status(status).send(response);
}