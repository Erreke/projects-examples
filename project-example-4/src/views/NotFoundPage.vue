<template>
  <NotFound />
</template>

<script>
import NotFound from "@/components/NotFound";

export default {
  name: "NotFoundPage",

  metaInfo() {
    return {
      title: this.$t("page-not-found.meta-title")
    };
  },

  components: {
    NotFound
  }
};
</script>
