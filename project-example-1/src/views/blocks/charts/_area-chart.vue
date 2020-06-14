<template>
  <article class="block__area-chart" :style="{ width: width }">
    <p v-if="title" class="subtitle">{{ title }}</p>
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    <v-chart ref="chart" :options="options" :autoresize="true" />
  </article>
</template>

<script>
export default {
  name: 'BlockAreaChart',

  props: {
    title: {
      type: String,
    },

    data: {
      type: Object,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    width: {
      type: String,
      default: '100%',
    },
  },

  computed: {
    left() {
      const max = Math.max(...this.data.series);

      return max.toString().length * 10;
    },

    options() {
      return {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.xAxis,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: this.data.series,
          type: 'line',
          areaStyle: {},
        }],
        grid: {
          top: 8,
          left: this.left,
          right: 20,
        },
      };
    },
  },

  destroyed() {
    // console.log('area chart destroyed');
    // console.log('this.$refs:', this.$refs);

    // this.$refs.chart.dispose();
  },
};
</script>

<style>
  .block__area-chart {
    position: relative;
    height: 400px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column;
  }
</style>
