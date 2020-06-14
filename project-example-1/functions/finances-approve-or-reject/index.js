const { db } = require('../admin');

function updateFinanceData(fid, data) {
  return db
    .collection('finances')
    .doc(fid)
    .update(data)
    .catch((e) => {
      console.error(e);
      throw new Error('Unable approving transfer');
    });
}

function fetchUserFinances(uid) {
  return db
    .collection('finances')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      const result = [];

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return result;
    })
    .catch((err) => {
      console.error('Unable getting User finances', err);
    });
}

async function isEnoughtMoney(uid, amount) {
  const userFinances = await fetchUserFinances(uid);

  const userBalance = userFinances
    .filter(item => item.isApproved)
    .map(item => item.amount)
    .reduce((prev, curr) => (prev * 100 + curr * 100) / 100, 0);

  return userBalance >= amount;
}

module.exports = async function(change, context) {
  const data = {
    fid: context.params.financeId,
    ...change.data(),
  };

  if (data.isTransferOut || data.isTransferIn) {
    let updatedData;
    let fromWhomUid;

    if (data.isTransferOut) {
      fromWhomUid = data.uid;
    } else {
      fromWhomUid = data.fromWhomUid;
    }

    const isEnought = await isEnoughtMoney(fromWhomUid, Math.abs(data.amount));

    if (isEnought) {
      updatedData = {
        isApproved: true,
        approvedAt: new Date(),
      };
    } else {
      updatedData = {
        isRejected: true,
        rejectedAt: new Date(),
        rejectReason: "Не хватает средств",
      };
    }

    return updateFinanceData(data.fid, updatedData);
  }

  if (data.isWithdrawal) {
    const isEnought = await isEnoughtMoney(data.uid, Math.abs(data.amount));

    if (!isEnought) {
      return updateFinanceData(data.fid, {
        isRejected: true,
        rejectedAt: new Date(),
        rejectReason: "Не хватает средств",
      });
    }

    return null;
  }

  return null;
};
