<template>
  <div :class="['menu_mobile menu_mobile_fullscreen', { 'opened': isActive }]">
    <div class="menu_mobile_inner">
      <a @click.prevent="closeMenu" href="#" class="menu_mobile_close icon-cancel"></a>

      <nav class="menu_mobile_nav_area">
        <ul class="prepared">
          <li class="menu-item" v-for="(item, key) in navigation" :key="key">
            <a @click.prevent="clickToMenuItem(key)" href="#">
              <span>{{ item }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="socials_mobile">
        <a class="social_item" :href="item" v-for="(item, key) in socialMediaLinks" :key="key">
          <span :class="`social_icon social_icon_${key}`">
            <span :class="`icon-${key}`"></span>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageMenu',

  props: {
    isActive: {
      type: Boolean,
      required: true,
    },

    navigation: {
      type: Object,
      required: true,
    },

    socialMediaLinks: {
      type: Object,
      required: true,
    },
  },

  methods: {
    clickToMenuItem(value) {
      this.$emit('click-to-menu-item', value);
    },

    closeMenu() {
      this.$emit('close-menu');
    },
  },
};
</script>
