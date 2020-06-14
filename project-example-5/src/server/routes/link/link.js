/* eslint-disable no-console */
import express from 'express';
import carouselAPI from '../../api/carousel';

const router = express.Router();

router.get('/', async (req, res) => {
  const link = await carouselAPI.getNextLink();
  res.redirect(link);
});

export default router;
