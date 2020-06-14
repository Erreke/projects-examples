import authAPI from '@/api/auth';
import dbAPI from '@/api/db';

export default {
  SIGN_OUT: ({ dispatch }) => authAPI.signOut()
    .then(() => dispatch('RESET_STATE', null, { root: true })),

  TEST() {
    return dbAPI.importInstimeData()
      .then((items) => {
        // eslint-disable-next-line no-console
        console.log('items:', items);
      });
  },

  // TEST() {
  //   return dbAPI.importInstimeData();
  // },
};
