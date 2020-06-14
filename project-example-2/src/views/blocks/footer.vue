<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p><strong>Coursomania</strong></p>
      <p>
        <a :href="item" v-for="(item, key) in socialMediaLinks" :key="key">
          {{ key }}
        </a>
      </p>
      <p>
        Республика Казахстан, <br />
        г.Алматы, мкрн. Керемет, дом 7, корпус 43
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "BlockFooter",

  data() {
    return {
      socialMediaLinks: {
        instagram: "https://instagram.com/",
        youtube: "https://www.youtube.com/"
      }
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.footer {
  z-index: 41;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: $sidebar-hover;
  color: #fff;
}
</style>
