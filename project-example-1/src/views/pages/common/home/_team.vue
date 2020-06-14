<template>
  <div class="
    vc_row wpb_row vc_row-fluid wpb_animate_when_almost_visible
    fadeIn vc_row-has-fill wpb_start_animation animated team
  ">
    <div class="wpb_column vc_column_container vc_col-sm-12 sc_layouts_column_icons_position_left">
      <div class="vc_column-inner">
        <div class="wpb_wrapper">
          <div class="sc_title color_style_default sc_title_accent">
            <h1 class="
              sc_item_title sc_title_title sc_align_center
              sc_item_title_style_accent sc_item_title_tag header
            ">
              Команда Автоматона
            </h1>
          </div>

          <p class="sc_align_center">Позвольте представить вам команду, которая делает все это.</p>

          <div class="sc_team color_style_default sc_team_short">
            <div class="
              sc_team_columns_wrap sc_item_columns trx_addons_columns_wrap columns_padding_bottom
            ">
              <div class="trx_addons_column-1_4" v-for="(item, key) in team" :key="key">
                <div class="
                  sc_team_item no_links post-226 cpt_team
                  type-cpt_team has-post-thumbnail
                  cpt_team_group-hoverex-team
                ">
                  <div class="
                    post_featured sc_team_item_thumb trx_addons_hover trx_addons_hover_style_info
                  ">
                    <img
                      width="370"
                      height="370"
                      class="
                        attachment-trx_addons-thumb-avatar
                        size-trx_addons-thumb-avatar wp-post-image
                      "
                      :src="require(`@/views/pages/common/home/images/team/${key}.jpg`)"
                      alt=""
                    >
                  </div>
                  <div class="sc_team_item_info">
                    <div class="sc_team_item_header">
                      <h4 class="sc_team_item_title">{{ item.name }}</h4>
                      <div class="sc_team_item_subtitle" v-html="item.position"></div>
                      <div class="sc_team_item_subtitle" v-if="item.url">
                        <a :href="`https://instagram.com/${item.url}/`">@{{ item.url }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sc_title color_style_default sc_title_accent">
            <h1 class="
              sc_item_title sc_title_title sc_item_title_style_accent
              sc_item_title_tag header sc_align_left
            ">
              Адвайзеры
            </h1>
          </div>

          <div class="sc_team color_style_default sc_team_short">
            <div class="
              sc_team_columns_wrap sc_item_columns
              trx_addons_columns_wrap columns_padding_bottom
            ">
              <div class="trx_addons_column-1_4" v-for="(item, key) in advisors" :key="key">
                <div class="
                  sc_team_item no_links post-226 cpt_team
                  type-cpt_team has-post-thumbnail
                  cpt_team_group-hoverex-team
                ">
                  <div class="
                    post_featured sc_team_item_thumb
                    trx_addons_hover trx_addons_hover_style_info
                  ">
                    <img
                      width="370"
                      height="370"
                      class="
                        attachment-trx_addons-thumb-avatar
                        size-trx_addons-thumb-avatar wp-post-image
                      "
                      :src="require(`@/views/pages/common/home/images/advisors/${key}.jpg`)"
                      alt=""
                    >
                  </div>
                  <div class="sc_team_item_info">
                    <div class="sc_team_item_header">
                      <h4 class="sc_team_item_title"><a href="#">{{ item.name }}</a></h4>
                      <div class="sc_team_item_subtitle" v-if="item.position">
                        {{ item.position }}
                      </div>
                      <div class="sc_team_item_subtitle" v-if="item.url">
                        <a :href="`https://instagram.com/${item.url}/`">@{{ item.url }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageTeam',

  data() {
    return {
      team: {
        adam: {
          name: 'Адам Цигельник',
          position: 'Основатель,<br> Генеральный директор',
          url: 'mr.adam',
        },
        yerbol: {
          name: 'Ербол Куандыков',
          position: 'Сооснователь,<br> Технический директор',
          url: 'yerbol_yermekuly',
        },
        dina: {
          name: 'Дина Ганиева',
          position: 'HR-директор',
          url: 'dinacigelnik',
        },
        ilya: {
          name: 'Илья Гузненков',
          position: 'Руководитель отдела продаж',
          url: 'ilyaguznenkov',
        },
        anna: {
          name: 'Анна Балобнова',
          position: 'Отдел продаж',
          url: 'hanna_laksmi_rerih',
        },
        muha: {
          name: 'Мұхаметәлі Арғынбайұлы',
          position: 'Отдел продаж',
          url: 'muhamed.08',
        },
        paul: {
          name: 'Пауль Децур',
          position: 'Отдел продаж',
          url: 'paul_detsur',
        },
        han: {
          name: 'Ханафия Мустафа',
          position: 'Отдел продаж',
          url: 'Han_production',
        },
      },

      advisors: {
        nastasia: {
          name: 'Настасья Белочкина',
          position: 'Эксперт по продажам',
          url: 'belochkina_nastassia',
        },
        rashid: {
          name: 'Рашид Нуриахметов',
          position: 'Эксперт по продажам',
          url: 'rash_nur',
        },
      },
    };
  },
};
</script>
