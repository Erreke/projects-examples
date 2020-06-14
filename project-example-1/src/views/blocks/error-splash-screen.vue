<template>
  <div class="error-splash-screen">
    <h1 class="title">{{ title }}</h1>
    <h2 class="subtitle" v-html="subtitle"></h2>
    <p v-if="routeName && linkText">
      <router-link :to="{ name: routeName }">{{ linkText }}</router-link>
    </p>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'BlockErrorSplashScreen',

  props: {
    title: {
      type: String,
      required: true,
      default: 'title',
    },
    subtitle: {
      type: String,
      required: true,
      default: 'subtitle',
    },
    routeName: {
      type: String,
    },
    linkText: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
  .error-splash-screen {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column;
    height: 100%;
    background: #050726;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
    text-align: center;
    padding: 1rem;

    .title,
    .subtitle {
      color: #fff;
    }
  }
</style>
