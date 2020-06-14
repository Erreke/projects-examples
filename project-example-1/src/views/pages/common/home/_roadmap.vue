<template>
  <div class="roadmap">
    <div class="vc_row wpb_row vc_row-fluid">
      <div class="
        wpb_column vc_column_container
        vc_col-sm-12 sc_layouts_column_icons_position_left
      ">
        <div class="vc_column-inner">
          <div class="wpb_wrapper">
            <div class="sc_title color_style_default sc_title_accent">
              <h1 class="
                sc_item_title sc_title_title sc_align_center
                sc_item_title_style_accent sc_item_title_tag
                header
              ">Дорожная карта клиента</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vc_row wpb_row vc_row-fluid">
      <div class="
        wpb_column vc_column_container vc_col-sm-12
        sc_layouts_column_icons_position_left
      ">
        <div class="vc_column-inner roadmap__graph">
          <v-chart :options="options" :autoresize="true" />

          <div class="roadmap__graph-desc">
            <p>
              <span>Первый год:</span>
              <ul>
                <li>первый квартал = 0 - $100;</li>
                <li>второй квартал = $100 - $500;</li>
                <li>третий квартал = $500 - $1 000;</li>
                <li>четвертый квартал = $1 000 - $3 000.</li>
              </ul>
            </p>
            <p>
              <span>Второй год:</span>
              <ul>
                <li>ежемесячная прибыль = $1 000 - $3 000.</li>
              </ul>
            </p>
            <p>
              <span>Третий год:</span>
              <ul>
                <li>ежемесячная прибыль = $3 000 - $5 000.</li>
              </ul>
            </p>
          </div>
        </div>
        <p class="roadmap__total">Итого за 3 года (36 мес) общая прибыль = $49 500 - $100 600.</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

export default {
  name: 'HomePageRoadmap',

  data() {
    return {
      options: {
        calculable: true,
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: [
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
            10, 11, 12,
            13, 14, 15,
            16, 17, 18,
            19, 20, 21,
            22, 23, 24,
            25, 26, 27,
            28, 29, 30,
            31, 32, 33,
            34, 35, 36,
          ],
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        series: [{
          data: [
            0, 0, 0,
            50, 150, 300,
            500, 600, 700,
            1000, 1500, 1700,
            2100, 2200, 2300,
            2400, 2500, 2600,
            2700, 2700, 2700,
            2800, 2900, 2900,
            3100, 3100, 3100,
            3200, 3200, 3200,
            3300, 3350, 3360,
            3370, 3400, 3500,
          ],
          type: 'line',
        }],
      },
    };
  },
};
</script>
