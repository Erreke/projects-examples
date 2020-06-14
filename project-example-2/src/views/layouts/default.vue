<template>
  <div :class="['layout', `layout_device_${this.$_device}`]">
    <app-navbar />

    <section>
      <slot />
    </section>

    <app-footer />

    <scroll-to-top />
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",

  components: {
    AppNavbar: () => import("@/views/blocks/navbar.vue"),
    AppFooter: () => import("@/views/blocks/footer.vue"),
    ScrollToTop: () => import("@/views/blocks/scroll-to-top.vue")
  }
};
</script>

<style lang="scss">
.layout {
  background-color: #ccc;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 100%;
  overflow: hidden;
}
</style>
