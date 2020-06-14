<template>
  <article class="block__pie-chart" :style="{ width: width }">
    <p v-if="title" class="subtitle">{{ title }}</p>
    <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    <v-chart ref="chart" :options="options" :autoresize="true" v-if="data.length" />
    <p v-else>{{ noDataText }}</p>
  </article>
</template>

<script>
export default {
  name: 'BlockPieChart',

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

    top: {
      type: Number,
      default: 50,
    },

    left: {
      type: Number,
      default: 50,
    },

    width: {
      type: String,
      default: '100%',
    },
  },

  computed: {
    options() {
      return {
        tooltip: {
          trigger: 'item',
          formatter(params) {
            let value = (`${params.value}`).split('.');

            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (value[1] ? `.${value[1]}` : '');

            return `${params.name}: ${value}(${params.percent}%)`;
          },
        },
        legend: this.isLegendActive
          ? {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 0,
            bottom: 20,
            data: this.data.map(item => item.name),
          }
          : null,
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: [`${this.left}%`, `${this.top}%`],
            data: this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    },
  },

  destroyed() {
    // console.log('pie chart destroyed');
    // console.log('this.$refs:', this.$refs);

    // this.$refs.chart.dispose();
  },
};
</script>

<style>
  .block__pie-chart {
    position: relative;
    height: 400px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column;
  }
</style>
