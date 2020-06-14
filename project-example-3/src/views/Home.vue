<template>
  <SignInForm />
</template>

<script>
import SignInForm from "@/components/SignInForm";

export default {
  components: {
    SignInForm
  },

  metaInfo() {
    return {
      title: this.$t("page-home.meta-title")
    };
  }
};
</script>
