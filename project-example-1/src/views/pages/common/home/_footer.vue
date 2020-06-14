<template>
  <footer class="footer_wrap footer_custom">
    <div class="vc_row wpb_row vc_row-fluid vc_row-has-fill sc_layouts_row
     sc_layouts_row_type_normal footer">
      <div class="wpb_column vc_column_container vc_col-sm-12 sc_layouts_column
       sc_layouts_column_align_center sc_layouts_column_icons_position_left">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">
            <div class="home__df-jc">
              <div class="home__w-50">
                <sign-up-for-webinar
                  text="Запишись на ближайшую онлайн демонстрацию сервиса"
                />
              </div>
            </div>

            <div class="sc_content color_style_default sc_content_default
             sc_float_center sc_align_center">
              <div class="sc_content_container">
                <div class="sc_layouts_item">
                  <div class="widget_area sc_widget_socials vc_widget_socials wpb_content_element">
                    <aside class="widget widget_socials">
                      <div class="socials_wrap sc_align_center">
                        <a class="social_item" :href="item"
                         v-for="(item, key) in socialMediaLinks" :key="key">
                          <span :class="`social_icon social_icon_${key}`">
                            <span :class="`icon-${key}`"></span>
                          </span>
                        </a>
                      </div>
                    </aside>
                  </div>
                </div>
                <p>
                  <a href="/Terms-of-Use.pdf" target="_blank">Правила использования Сервиса</a>
                  <br>
                  <a href="/Offer.pdf" target="_blank">Оферта о заключении договора</a>
                  <br>
                  <a href="/Privacy-Policy.pdf" target="_blank">Политика конфиденциальности</a>
                </p>
                <div class="vc_wp_text wpb_content_element">
                  <div class="widget widget_text">
                    <div class="textwidget">
                      <p>Республика Казахстан,
                        <br> г.Алматы, мкрн. Керемет, дом 7, корпус 43
                        <br> <a class="copyright-tel is-kz" href="tel:+77470942338" v-html="'+7&nbsp;747&nbsp;094&nbsp;2338'"></a>
                        <br> <a class="copyright-tel is-ru" href="tel:+79585812880" v-html="'+7&nbsp;958&nbsp;581&nbsp;2880'"></a>
                        <br> <a class="copyright-tel is-wa" href="https://api.whatsapp.com/send?phone=77755158309&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!" target="_blank" v-html="'+7&nbsp;775&nbsp;515&nbsp;8309'"></a>
                      </p>
                    </div>
                  </div>
                </div>
                <p class="copyright">Project-example-1© 2019 Все права защищены.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import SignUpForWebinar from './_sign-up-for-webinar.vue';

export default {
  name: 'HomePageFooter',

  props: {
    socialMediaLinks: {
      type: Object,
      required: true,
    },
  },

  components: {
    SignUpForWebinar,
  },
};
</script>
