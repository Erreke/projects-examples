<template>
  <header class="top_panel top_panel_custom top_panel_custom_747
   top_panel_custom_header-home2 with_bg_image">
    <div class="vc_row wpb_row vc_row-fluid vc_row-o-equal-height vc_row-o-content-middle
     vc_row-flex sc_layouts_row sc_layouts_row_fixed sc_layouts_hide_on_mobile
      sc_layouts_hide_on_tablet">
      <div class="wpb_column vc_column_container vc_col-sm-9 vc_col-lg-9 sc_layouts_column
       sc_layouts_column_align_left sc_layouts_column_icons_position_left">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">
            <div class="sc_layouts_item">
              <a href="#" class="sc_layouts_logo sc_layouts_logo_default">
                <img class="logo_image" src="./images/logo.png" alt="" width="148" height="17">
              </a>
            </div>
            <!-- <div class="sc_layouts_item">
              <nav class="sc_layouts_menu sc_layouts_menu_default sc_layouts_menu_dir_horizontal
               menu_hover_fade hide_on_mobile inited">
                <ul class="sc_layouts_menu_nav inited sf-js-enabled sf-arrows"
                 style="touch-action: pan-y;">
                  <li class="menu-item" v-for="(item, key) in navigation" :key="key">
                    <a @click.prevent="clickToMenuItem(key)" href="#">
                      <span>{{ item }}</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div> -->
          </div>
        </div>
      </div>
      <div class="wpb_column vc_column_container vc_col-sm-3 vc_col-lg-3 sc_layouts_column
       sc_layouts_column_align_right sc_layouts_column_icons_position_left">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">
            <div class="sc_layouts_item">
              <div class="sc_layouts_login sc_layouts_menu sc_layouts_menu_default inited">
                <a v-if="$_user" @click.prevent="goToCabinet" href="#"
                 class="trx_addons_login_link">
                  <span class="trx_addons_login_link__icon trx_addons_icon-user-alt"></span>
                  <span class="trx_addons_login_link__text">Перейти в кабинет</span>
                </a>
                <a v-else @click.prevent="showAuthPopup" href="#" class="trx_addons_login_link">
                  <span class="trx_addons_login_link__icon trx_addons_icon-user-alt"></span>
                  <span class="trx_addons_login_link__text">Вход и Регистрация</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="vc_row wpb_row vc_row-fluid vc_row-o-equal-height vc_row-o-content-middle
     vc_row-flex sc_layouts_row sc_layouts_row_type_compact sc_layouts_row_fixed
      sc_layouts_hide_on_desktop sc_layouts_hide_on_notebook">
      <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-lg-6 vc_col-xs-6
       sc_layouts_column sc_layouts_column_align_left sc_layouts_column_icons_position_left">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">
            <div class="sc_layouts_item">
              <a href="#" class="sc_layouts_logo sc_layouts_logo_default"><img class="logo_image"
               src="./images/logo.png" alt="" width="148" height="17"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="wpb_column vc_column_container vc_col-sm-6 vc_col-xs-6 sc_layouts_column
       sc_layouts_column_align_right sc_layouts_column_icons_position_left">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">

            <div class="sc_layouts_item">
              <div class="sc_layouts_iconed_text sc_layouts_menu_mobile_button">
                <a @click.prevent="showAuthPopup" class="sc_layouts_item_link
                 sc_layouts_iconed_text_link" href="#">
                  <span class="sc_layouts_item_icon sc_layouts_iconed_text_icon
                   trx_addons_icon-user-alt white"></span>
                </a>
              </div>
            </div>

            <!-- <div class="sc_layouts_item">
              <div class="sc_layouts_iconed_text sc_layouts_menu_mobile_button">
                <a @click.prevent="openMenu" class="sc_layouts_item_link
                 sc_layouts_iconed_text_link" href="#">
                  <span class="sc_layouts_item_icon sc_layouts_iconed_text_icon
                   trx_addons_icon-menu"></span>
                </a>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'HomePageHeader',

  props: {
    navigation: {
      type: Object,
      required: true,
    },
  },

  methods: {
    ...mapMutations('auth', {
      setAuthPopupOpenedStatus: 'SET_POPUP_OPENED_STATUS',
    }),

    clickToMenuItem(value) {
      this.$emit('click-to-menu-item', value);
    },

    showAuthPopup() {
      this.setAuthPopupOpenedStatus(true);
    },

    openMenu() {
      this.$emit('open-menu');
    },

    goToCabinet() {
      if (this.$_user.isAdmin) {
        this.$router.push({ name: 'admin-clients' });
      } else {
        this.$router.push({ name: 'dashboard' });
      }
    },
  },
};
</script>
