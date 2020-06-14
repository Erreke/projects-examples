<template>
  <article class="block__bar-chart" :style="{ width, height }">
    <p v-if="title" class="subtitle">{{ title }}</p>
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    <v-chart ref="chart" :options="options" :autoresize="true" v-if="data.length" />
    <p v-else>{{ noDataText }}</p>
  </article>
</template>

<script>
export default {
  name: 'BlockBarChart',

  props: {
    title: {
      type: String,
    },

    data: {
      type: Array,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    isLegendActive: {
      type: Boolean,
      default: true,
    },

    noDataText: {
      type: String,
      required: true,
    },

    width: {
      type: String,
      default: '100%',
    },
  },

  computed: {
    fiteredData() {
      return this.data.filter(item => item);
    },

    left() {
      const maxValue = Math.max(...this.fiteredData.map(item => item.data[0]));

      let left = maxValue.toString().length * 10 + 10;

      if (this.$_device === 'mobile' || this.$_device === 'tablet') {
        return left;
      }

      if (this.isLegendActive) {
        const maxLabel = Math.max(...this.fiteredData.map(item => item.name.length * 10));

        left += maxLabel;

        return left < 100 ? left + 40 : left;
      }

      return left;
    },

    bottom() {
      return this.$_device === 'mobile' || this.$_device === 'tablet' ? 300 : 5;
    },

    height() {
      return this.$_device === 'mobile' || this.$_device === 'tablet' ? '600px' : '400px';
    },

    legendTop() {
      return this.$_device === 'mobile' || this.$_device === 'tablet' ? 300 : 0;
    },

    options() {
      return {
        color: this.fiteredData.map(item => item.color),
        tooltip: {
          trigger: 'item',
        },
        legend: this.isLegendActive ? {
          type: 'scroll',
          orient: 'vertical',
          left: 0,
          top: this.legendTop,
          data: this.fiteredData.map(item => item.name),
        }
          : null,
        calculable: true,
        xAxis: [
          {
            type: 'category',
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        grid: {
          top: 8,
          left: this.left,
          bottom: this.bottom,
          right: 20,
        },
        series: this.data,
      };
    },
  },

  destroyed() {
    // console.log('bar chart destroyed');
    // console.log('this.$refs:', this.$refs);

    // this.$refs.chart.dispose();
  },
};
</script>

<style>
  .block__bar-chart {
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column;
  }
</style>
