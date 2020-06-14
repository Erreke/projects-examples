/* eslint-disable max-len */
import profileAPI from '@/api/profile';

let unsubFromUserChanges;
let unsubFromUserFollowers;
let unsubFromUserDiscount;

export default function subscribeToFirestore(store) {
  function updateUserProfile(payload) {
    store.commit('user/UPDATE_USER', payload);
  }

  function updateUserFollowers(payload) {
    store.commit('user/SET_USER_FOLLOWERS', payload);
  }

  function updateUserDiscount(payload) {
    store.commit('user/SET_USER_DISCOUNT', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'user/SET_USER') {
      if (!unsubFromUserChanges) {
        unsubFromUserChanges = profileAPI.subscribeToUserProfileChanges(mutation.payload.uid, updateUserProfile);
      }
    }

    if (mutation.type === 'user/SET_USER_FOLLOWERS') {
      if (!unsubFromUserFollowers) {
        unsubFromUserFollowers = profileAPI.subscribeToUserFollowersChanges(mutation.payload.uid, updateUserFollowers);
      }
    }

    if (mutation.type === 'user/SET_USER_DISCOUNT') {
      if (!unsubFromUserDiscount) {
        unsubFromUserDiscount = profileAPI.subscribeToUserDiscountChanges(mutation.payload.uid, updateUserDiscount);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromUserChanges && typeof unsubFromUserChanges === 'function') {
        unsubFromUserChanges();
      }

      if (unsubFromUserFollowers && typeof unsubFromUserFollowers === 'function') {
        unsubFromUserFollowers();
      }

      if (unsubFromUserDiscount && typeof unsubFromUserDiscount === 'function') {
        unsubFromUserDiscount();
      }
    }
  });
}


// import redirectsAPI from '@/api/admin/redirects';

// let unsubFromRedirectsInfoChanges;
// let unsubFromAvailablePhonesChanges;

// export default function subscribeToFirestore(store) {
//   function updateUserProfile(payload) {
//     store.commit('redirects/SET_ALL_REDIRECTS_INFO', payload);
//   }

//   function updateAvailablePhones(payload) {
//     store.commit('redirects/SET_AVAILABLE_PHONES', payload);
//   }

//   const unsubscribe1 = store.subscribe((mutation) => {
//     if (mutation.type === 'redirects/SET_ALL_REDIRECTS_INFO') {
//       if (!unsubFromRedirectsInfoChanges) {
//         unsubFromRedirectsInfoChanges = redirectsAPI.subscribeToRedirectsInfoChanges(updateUserProfile);
//       }
//     }

//     if (mutation.type === 'user/UNSET_USER') {
//       if (unsubFromRedirectsInfoChanges && typeof unsubFromRedirectsInfoChanges === 'function') {
//         unsubFromRedirectsInfoChanges();
//       }
//     }
//   });

//   const unsubscribe2 = store.subscribe((mutation) => {
//     if (mutation.type === 'redirects/SET_AVAILABLE_PHONES') {
//       if (!unsubFromAvailablePhonesChanges) {
//         unsubFromAvailablePhonesChanges = redirectsAPI.subscribeToAvailablePhonesChanges(updateAvailablePhones);
//       }
//     }

//     if (mutation.type === 'user/UNSET_USER') {
//       if (unsubFromAvailablePhonesChanges && typeof unsubFromAvailablePhonesChanges === 'function') {
//         unsubFromAvailablePhonesChanges();
//       }
//     }
//   });

//   if (!store.$_unsubscribers) {
//     Object.defineProperty(store, '$_unsubscribers', {
//       enumerable: false,
//       configurable: false,
//       writable: false,
//       value: [],
//     });
//   }

//   store.$_unsubscribers.push(unsubscribe1);
//   store.$_unsubscribers.push(unsubscribe2);
// }
