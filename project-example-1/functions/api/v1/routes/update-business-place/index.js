const { db } = require('../../../../admin');
const getInstimeInfo = require('../../utils/get-instime-info');

module.exports = async (req, res) => {
  let status;
  let response;

  try {
    const id = req.query.id || null;

    if (!id) {
      status = 400;
      response = {
        error: 'INVALID_ID'
      };
    } else {
      const instimeInfo = await getInstimeInfo(id);

      if (instimeInfo) {
        status = 200;
        response = await db
          .collection('business_places')
          .doc(id)
          .update({ 
            ...instimeInfo,
            isTimeToSynchronize: false,
            synchronizedAt: new Date(),
          });
      } else {
        status = 400;
        response = {
          error: 'INFO_NOT_FOUND'
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