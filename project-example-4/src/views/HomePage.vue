<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm11 md10 text-xs-center>
            <h1 class="display-3 font-weight-thin">
              {{ $t("block-global.platform-for-webinars") }}
            </h1>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "HomePage",

  metaInfo() {
    return {
      title: this.$t("block-global.platform-for-webinars")
    };
  }
};
</script>
