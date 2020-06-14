import Cleave from 'cleave.js';

export default {
  bind(el, params) {
    const input = el.querySelector('input');

    const mask = {
      delimiters: [''],
      blocks: [params.value],
      numericOnly: true,
    };

    // eslint-disable-next-line no-underscore-dangle
    input._vCleave = new Cleave(input, mask);
  },

  unbind(el) {
    const input = el.querySelector('input');

    // eslint-disable-next-line no-underscore-dangle
    input._vCleave.destroy();
  },
};
