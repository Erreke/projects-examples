<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 text-xs-center>
        <h1 class="display-3 font-weight-thin">
          {{ $t("page-not-found.title") }}
        </h1>
        <p>{{ $t("page-not-found.subtitle") }}</p>
        <v-btn dark color="blue-grey" href="/">{{
          $t("page-not-found.back-to-home")
        }}</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
