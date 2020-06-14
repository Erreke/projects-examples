const express = require('express');
const api = require('../api');
const router = express.Router();

router.get('/:id', function(req, res, next) {
  api.getRedirectInfo(req.params.id)
    .then((response) => {
      if (response && response.redirectTo) {
        res.redirect(response.redirectTo);
      } else {
        res.send(404, '404 Not found');
      }
    });
});

module.exports = router;
