export default function formErrorsComposer(vm, field) {
  const errors = [];

  if (!vm.$v[field].$dirty) return errors;

  !vm.$v[field].required &&
    errors.push(vm.$t("block-errors.field-is-required"));

  !vm.$v[field].minLength &&
    errors.push(
      vm.$t("block-errors.field-must-be-min-length", {
        length: vm.$v[field].$params.minLength.min
      })
    );

  !vm.$v[field].maxLength &&
    errors.push(
      vm.$t("block-errors.field-must-be-max-length", {
        length: vm.$v[field].$params.maxLength.max
      })
    );

  if (field === "fullname") {
    !vm.$v[field].fullname &&
      errors.push(vm.$t("block-errors.field-must-be-fullname"));
  }

  if (field === "email") {
    !vm.$v[field].email && errors.push(vm.$t("block-errors.invalid-email"));
  }

  if (field === "phone") {
    !vm.$v[field].phone &&
      errors.push(vm.$t("block-errors.field-must-be-phone"));
  }

  return errors;
}
