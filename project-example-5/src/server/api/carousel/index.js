const { db } = require('../../firebase/init');
const getLinkToBot = require('./_get-link-to-bot');
const getRequestNumberAndMakeNewQueue = require('./_get-request-number-and-make-new-queue');
const breakIntoGroups = require('./_break-into-groups');
const getReflinks = require('./_get-reflinks');

module.exports = {
  getNextLink() {
    const reflinksRef = db.collection('carousel_reflinks');
    const metaDocRef = db.collection('carousel_meta').doc('meta');

    return db.runTransaction((transaction) => transaction
      .get(metaDocRef)
      .then(async (metaDoc) => {
        if (!metaDoc.exists) {
          throw new Error('Meta does not exist!');
        }

        const meta = metaDoc.data();
        const reflinksSnapshot = await transaction.get(reflinksRef);
        const reflinks = getReflinks(reflinksSnapshot);
        const groups = breakIntoGroups(reflinks);
        const { requestNumber, newQueue } = getRequestNumberAndMakeNewQueue(meta.queue, groups);
        const linkToBot = getLinkToBot(meta, requestNumber);

        transaction.update(metaDocRef, { queue: newQueue });

        console.log('queue:', meta.queue);
        console.log('newQueue:', newQueue);
        console.log('requestNumber:', requestNumber);
        console.log('linkToBot:', linkToBot);

        return linkToBot;
      }));
  },
};
