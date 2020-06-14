import protoState from '@/store/modules/auth/proto-state';

export default {
  ...protoState(),

  firstFormErrors: [],
  secondFormErrors: [],
  isFirstFormProcessing: false,
  isSecondFormProcessing: false,
  firstFormResult: null,
  secondFormResult: null,
  tempNewPhoneNumber: null,
};
