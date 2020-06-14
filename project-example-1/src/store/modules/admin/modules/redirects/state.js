export default {
  info: {},
  errors: null,
  allInfo: [],
  allErrors: null,
  isAllInfoLoading: false,
  isCreateOrUpdateProcessing: false,
  isDeleting: false,

  creatingError: null,
  deletingError: null,

  availablePhonesErrors: null,
  isAvailablePhonesProcessing: false,
  availablePhones: [],

  isNewPhoneCreating: false,

  createOrUpdateFormItems: {
    type: 'whatsapp',
    redirectFrom: '',
    redirectTo: '',
    phone: '',
    text: '',
    file: null,
    isFileChanged: false,
  },
};
