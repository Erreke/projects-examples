export default {
  clientsAll(state) {
    return Object.values(state.clients)
      .filter(item => !item.isAdmin && !item.deleted);
  },

  clientsFreshlyRegistered(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink == null
        && item.projectReferralLink === null
        && !item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction === null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWhoTakedReferralLink(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink === null
        && !item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction === null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsForReferralLinkChecking(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && !item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction === null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWithApprovedReferralLinks(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction === null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWithDisapprovedReferralLinks(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && !item.isProjectReferralLinkApproved
        && item.isProjectReferralLinkDisapproved
        && item.transaction === null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsForTransactionConfirmation(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction !== null
        && !item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWithTransactionConfirmed(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction !== null
        && item.isTransactionConfirmed
        && !item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWithTransactionRejected(state, getters) {
    return getters.clientsAll.filter(item => item.curatorReferralLink !== null
        && item.projectReferralLink !== null
        && item.isProjectReferralLinkApproved
        && !item.isProjectReferralLinkDisapproved
        && item.transaction !== null
        && !item.isTransactionConfirmed
        && item.isTransactionRejected
        && !item.isArchived
        && !item.isPostpounded);
  },

  clientsWithArchivedAccount(state, getters) {
    return getters.clientsAll.filter(item => item.isArchived);
  },

  clientsWithPostpoundedAccount(state, getters) {
    return getters.clientsAll.filter(item => item.isPostpounded);
  },

  clientsAllCount(state, getters) {
    return getters.clientsAll.length;
  },
};
