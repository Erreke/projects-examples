import Cleave from 'cleave.js';

export default {
  bind(el, binding) {
    const input = el.querySelector('input');
    // eslint-disable-next-line no-underscore-dangle
    input._vCleave = new Cleave(input, binding.value);
  },
  unbind(el) {
    const input = el.querySelector('input');
    // eslint-disable-next-line no-underscore-dangle
    input._vCleave.destroy();
  },
};
