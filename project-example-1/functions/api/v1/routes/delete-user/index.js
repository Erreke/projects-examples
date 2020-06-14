const isUserAdmin = require('../../utils/is-user-admin');
const deleteUser = require('../../utils/delete-user');

module.exports = async (req, res) => {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const errors = [];
    const uid = req.body.uid || null;
    const aid = req.body.aid || null;

    if (!uid) {
      errors.push({
        uid: 'FIELD_IS_REQUIRED'
      });
    }

    if (!aid) {
      errors.push({
        aid: 'FIELD_IS_REQUIRED'
      });
    }

    const isAdmin = await isUserAdmin(aid);

    if (!isAdmin) {
      errors.push({
        common: 'PERMISSION_DENIED'
      });
    }

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors
      };

      res.status(status).send(response);
    } else {
      const isDeleted = await deleteUser(uid);

      if (isDeleted) {
        status = 200;
        response = {
          success: true
        };

        res.status(status).send(response);
      } else {
        res.status(status).send(response);
      }
    }
  }
  catch (error) {
    console.error("Error on deleting User:", error);

    status = 400;
    response = {
      success: false,
      errors: error
    };

    res.status(status).send(response);
  }
};
