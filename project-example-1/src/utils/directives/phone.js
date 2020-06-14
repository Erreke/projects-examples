// import Cleave from 'cleave.js';
// import codes from './phone-codes.json';

// let listener = null;

export default {
  bind() {
    // const input = el.querySelector('input');

    // listener = (e) => {
    //   const { value } = e.target;

    //   const code = codes.find(item => item.mask.includes(value));

    //   // eslint-disable-next-line no-console
    //   console.log('listener value:', value);
    //   // eslint-disable-next-line no-console
    //   console.log('listener code:', code);

    //   const mask = {
    //     prefix: '+',
    //     delimiters: ['(', ')', '-', '-'],
    //     blocks: [4, 3, 3, 2, 2],
    //     numericOnly: true,
    //   };

    //   // eslint-disable-next-line no-underscore-dangle
    //   input._vCleave = new Cleave(input, mask);
    // };

    // input.addEventListener('input', listener);

    // const mask = {
    //   prefix: '+',
    //   delimiters: ['(', ')', '-', '-'],
    //   blocks: [2, 3, 3, 2, 2],
    //   numericOnly: true,
    // };

    // eslint-disable-next-line no-underscore-dangle
    // input._vCleave = new Cleave(input, mask);
  },

  unbind() {
    // const input = el.querySelector('input');

    // input.removeEventListener('input', listener);

    // eslint-disable-next-line no-underscore-dangle
    // input._vCleave.destroy();
  },
};
