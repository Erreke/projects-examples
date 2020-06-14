/* eslint-disable no-console */
import db from '@/utils/firebase/init';
import instimeData from '../../instime-data.json';
// import instimeData from '../../instime-data-example.json';

function test() {
  return db.collection('profiles')
    .where('isTransactionConfirmed', '==', true)
    .where('isAdmin', '==', false)
    .where('isAgent', '==', false)
    .where('isArchived', '==', false)
    // .where('isDisabled', '==', false)
    .where('autoReferralsCount', '<', 3)
    .orderBy('autoReferralsCount', 'desc')
    .orderBy('transactionConfirmedAt')
    .get()
    .then((snapshot) => {
      const nextCurators = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          nextCurators.push({
            cid: doc.id,
            ...doc.data(),
          });
        });
      }

      return nextCurators;
    });
}

function test3() {
  return db.collection('business_places')
    .where('parent', '==', null)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return 'EMPTY';
      }

      const places = [];

      snapshot.forEach((doc) => {
        places.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return places;
    });
}

function test4(uid) {
  return db.collection('business_places')
    .where('uid', '==', uid)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return 'EMPTY';
      }

      const businessPlaces = [];

      snapshot.forEach((doc) => {
        businessPlaces.push({
          ...doc.data(),
        });
      });

      return businessPlaces;
    });
}

const firstNames = ['adamant', 'adroit', 'amatory', 'animistic', 'antic', 'arcadian', 'baleful', 'bellicose', 'bilious', 'boorish', 'calamitous', 'caustic', 'cerulean', 'comely', 'concomitant', 'contumacious', 'corpulent', 'crapulous', 'defamatory', 'didactic', 'dilatory', 'dowdy', 'efficacious', 'effulgent', 'egregious', 'endemic', 'equanimous', 'execrable', 'fastidious', 'feckless', 'fecund', 'friable', 'fulsome', 'garrulous', 'guileless', 'gustatory', 'heuristic', 'histrionic', 'hubristic', 'incendiary', 'insidious', 'insolent', 'intransigent', 'inveterate', 'invidious', 'irksome', 'jejune', 'jocular', 'judicious', 'lachrymose', 'limpid', 'loquacious', 'luminous', 'mannered', 'mendacious', 'meretricious', 'minatory', 'mordant', 'munificent', 'nefarious', 'noxious', 'obtuse', 'parsimonious', 'pendulous', 'pernicious', 'pervasive', 'petulant', 'platitudinous', 'precipitate', 'propitious', 'puckish', 'querulous', 'quiescent', 'rebarbative', 'recalcitant', 'redolent', 'rhadamanthine', 'risible', 'ruminative', 'sagacious', 'salubrious', 'sartorial', 'sclerotic', 'serpentine', 'spasmodic', 'strident', 'taciturn', 'tenacious', 'tremulous', 'trenchant', 'turbulent', 'turgid', 'ubiquitous', 'uxorious', 'verdant', 'voluble', 'voracious', 'wheedling', 'withering', 'zealous'];
const secondNames = ['ninja', 'chair', 'pancake', 'statue', 'unicorn', 'rainbows', 'laser', 'senor', 'bunny', 'captain', 'nibblets', 'cupcake', 'carrot', 'gnomes', 'glitter', 'potato', 'salad', 'toejam', 'curtains', 'beets', 'toilet', 'exorcism', 'stick figures', 'mermaid eggs', 'sea barnacles', 'dragons', 'jellybeans', 'snakes', 'dolls', 'bushes', 'cookies', 'apples', 'ice cream', 'ukulele', 'kazoo', 'banjo', 'opera singer', 'circus', 'trampoline', 'carousel', 'carnival', 'locomotive', 'hot air balloon', 'praying mantis', 'animator', 'artisan', 'artist', 'colorist', 'inker', 'coppersmith', 'director', 'designer', 'flatter', 'stylist', 'leadman', 'limner', 'make-up artist', 'model', 'musician', 'penciller', 'producer', 'scenographer', 'set decorator', 'silversmith', 'teacher', 'auto mechanic', 'beader', 'bobbin boy', 'clerk of the chapel', 'filling station attendant', 'foreman', 'maintenance engineering', 'mechanic', 'miller', 'moldmaker', 'panel beater', 'patternmaker', 'plant operator', 'plumber', 'sawfiler', 'shop foreman', 'soaper', 'stationary engineer', 'wheelwright', 'woodworkers'];

function randomName(list) {
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function seedAddProfile() {
  const userProfile = {
    firstName: randomName(firstNames),
    secondName: randomName(secondNames),
    bonusHolderNick: null,
    locale: 'ru',

    hasInitialPasswordBeenChanged: false,
    avatar: null,
    nickname: null,
    instagram: null,
    gender: null,
    country: null,
    city: null,
    isAdmin: false,
    bonusHolderId: 'EChNCluoJLfEW8SbNt3NJ1ATEYC2',
    isArchived: false,
    archivedAt: null,
    createdAt: new Date(),
  };

  return db
    .collection('profiles')
    .doc()
    .set(userProfile)
    .then(() => userProfile)
    .catch((error) => {
      console.error('Error on createUserProfile:', error);

      throw new Error(error.code.replace('auth/', ''));
    });
}

async function seedChangeProfile() {
  const profiles = await db
    .collection('profiles')
    .get()
    .then((snapshot) => {
      const clients = {};

      snapshot.forEach((doc) => {
        clients[doc.id] = {
          uid: doc.id,
          ...doc.data(),
        };
      });

      return clients;
    });

  const batch = db.batch();

  Object.keys(profiles).forEach((item) => {
    const docRef = db.collection('profiles').doc(item);
    batch.update(docRef, { birthday: randomDate(new Date(1950, 0, 1), new Date(2002, 0, 1)) });
  });

  return batch.commit();
}

function calcNumber(generation) {
  if (generation === 1) return 1;

  let currSumm = 1;
  let currMult = 1;

  for (let i = 0; i < generation - 1; i += 1) {
    currMult *= 3;
    currSumm = currMult + currSumm;
  }

  return currSumm;
}

const businessPlaces = [[]];
let i = 0;
let generation = 0;
let packageName = null;
const numbers = {};

function flatChilds(businessPlace, parentId) {
  if (businessPlaces[i].length === 100) {
    i += 1;
    businessPlaces[i] = [];
  }

  const { username } = businessPlace;
  const number = parseInt(username.split('a1user_')[1], 10);

  if (username === 'user3') {
    generation = 1;
    packageName = 'VIP';
  }

  if (number >= 1 && number <= 3) {
    generation = 2;
    packageName = 'VIP';
  }

  if (number >= 4 && number <= 12) {
    generation = 3;
    packageName = 'VIP';
  }
  if (number >= 13 && number <= 39) {
    generation = 4;
    packageName = 'VIP';
  }
  if (number >= 40 && number <= 120) {
    generation = 5;
    packageName = 'VIP';
  }
  if (number >= 121 && number <= 363) {
    generation = 6;
    packageName = 'Premium';
  }
  if (number >= 364 && number <= 1092) {
    generation = 7;
    packageName = 'Business';
  }
  if (number >= 1093 && number <= 3279) {
    generation = 8;
    packageName = 'Standard';
  }
  if (number >= 3280 && number <= 9840) {
    generation = 9;
    packageName = 'Standard';
  }

  if (!numbers[generation]) {
    if (numbers[generation - 1]) {
      numbers[generation] = calcNumber(generation - 1);
    } else {
      numbers[generation] = 0;
    }
  }

  numbers[generation] += 1;

  businessPlaces[i].push({
    generation,
    packageName,
    number: numbers[generation],
    amount: 0,
    instimeAmount: 0,
    autoReferralsAges: [],
    autoReferralsGenders: [],
    autoReferralsGeoKeys: [],
    autoReferralsGeoValues: [],
    autoReferralsTotalCount: 0,
    balance: 0,
    discountedPrice: 0,
    regularPrice: 0,
    phone: null,
    email: null,
    expiredAt: null,
    purchasedAt: null,
    instimeExpiredAt: null,
    instimePurchasedAt: null,
    hasDiscount: false,
    instimePaymentUrl: null,
    isAttemptedToPay: false,
    isAttemptedToPayInstime: false,
    isPurchased: false,
    isInstimePurchased: false,
    isTimeToSynchronize: false,
    paymentCardDate: null, // "04/23"
    paymentCardNumber: null, // "3453 **** **** 4532"
    paymentCardType: null, // "MasterCard"
    paymentType: null, // "BY_CARD"
    synchronizedAt: null,
    totalEarned: 0,
    uid: null,
    parentUid: null,
    instagram: businessPlace.username,
    referralCode: businessPlace.referral_code,
    parent: parentId,
    childs: businessPlace.childs.map(item => item.referral_code),
  });

  if (businessPlace.childs.length) {
    businessPlace.childs.forEach((item) => {
      flatChilds(item, businessPlace.referral_code);
    });
  }
}

async function importInstimeData() {
  instimeData.forEach((item) => {
    flatChilds(item, null);
  });

  const promises = businessPlaces.map((businessPlace) => {
    const batch = db.batch();

    businessPlace.forEach((item) => {
      const docRef = db.collection('business_places').doc(item.referralCode);
      batch.set(docRef, item);
    });

    return batch.commit();
  });

  return Promise
    .all(promises)
    .then((items) => {
      // eslint-disable-next-line no-console
      console.log('items:', items);
    });
}

const parents = [];

async function getParent(bpid) {
  return db.collection('business_places')
    .doc(bpid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const { uid, parent } = doc.data();

        if (parent) {
          parents.push({
            id: parent,
            uid,
          });

          return getParent(parent);
        }

        return false;
      }

      return false;
    });
}

async function testPromiseRecursion(parent, parentUid) {
  parents.push({
    id: parent,
    uid: parentUid,
  });

  await getParent(parent);

  return parents;
}

function getQueuedBusinessPlace(pckgName) {
  return db
    .collection('business_places')
    .where('packageName', '==', pckgName)
    .where('isPurchased', '==', false)
    .where('isInstimePurchased', '==', false)
    .where('uid', '==', null)
    .orderBy('number', 'asc')
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return null;
      }

      const businessPlace = [];

      snapshot.forEach((doc) => {
        businessPlace.push(doc.id);
      });

      return businessPlace[0];
    });
}

export default {
  test,
  test3,
  test4,
  seedAddProfile,
  seedChangeProfile,
  importInstimeData,
  testPromiseRecursion,
  getQueuedBusinessPlace,
};
