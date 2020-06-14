export default function (user) {
  if (
    user
    && user.curatorReferralLink === null
    && user.projectReferralLink === null
    && !user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction === null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'CURATOR_REFERRAL_LINK_NOT_EXIST_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink === null
    && !user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction === null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'CURATOR_REFERRAL_LINK_EXIST_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && !user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction === null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'REFERRAL_LINK_CHECKING_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && !user.isProjectReferralLinkApproved
    && user.isProjectReferralLinkDisapproved
    && user.transaction === null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'REFERRAL_LINK_DISAPPROVED_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction === null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'REFERRAL_LINK_APPROVED_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction !== null
    && !user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'TRANSACTION_CHECKING_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction !== null
    && !user.isTransactionConfirmed
    && user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'TRANSACTION_REJECTED_MODE';
  }

  if (
    user
    && user.curatorReferralLink !== null
    && user.projectReferralLink !== null
    && user.isProjectReferralLinkApproved
    && !user.isProjectReferralLinkDisapproved
    && user.transaction !== null
    && user.isTransactionConfirmed
    && !user.isTransactionRejected
    && !user.isArchived
    && !user.isPostpounded
  ) {
    return 'TRANSACTION_CONFIRMED_MODE';
  }

  if (
    user
    && user.isArchived
    && !user.isPostpounded
  ) {
    return 'ARCHIVED_MODE';
  }

  if (user
    && !user.isArchived
    && user.isPostpounded
  ) {
    return 'POSTPOUNDED_MODE';
  }

  return 'UNKNOWN_MODE';
}
