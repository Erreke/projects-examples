import protoState from '@/store/modules/auth/proto-state';

export default {
  ...protoState(),

  isBonusHolderValidating: false,
  bonusHolderValidatingResult: null,
  bonusHolderValidatingErrors: [],
};
