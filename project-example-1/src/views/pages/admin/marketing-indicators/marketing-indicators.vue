<template>
  <admin-layout :title="$t('page-admin-marketing-indicators.meta-title')">
    <b-tabs v-model="activeTab" class="admin-marketing-indicators">
      <b-tab-item :label="$t('page-admin-marketing-indicators.tab-growth')">
        <growth-indicators />
      </b-tab-item>
      <b-tab-item :label="$t('page-admin-marketing-indicators.tab-gender')">
        <gender-indicators />
      </b-tab-item>
      <b-tab-item :label="$t('page-admin-marketing-indicators.tab-age')">
        <age-indicators />
      </b-tab-item>
      <b-tab-item :label="$t('page-admin-marketing-indicators.tab-geo')">
        <geo-indicators />
      </b-tab-item>
    </b-tabs>
  </admin-layout>
</template>

<script>
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';

export default {
  name: 'AdminMarketingIndicatorsPage',

  usedVuexModules: ['admin'],

  data() {
    return {
      activeTab: 0,
    };
  },

  components: {
    GrowthIndicators: () => import('./_growth.vue'),
    GenderIndicators: () => import('./_gender.vue'),
    AgeIndicators: () => import('./_age.vue'),
    GeoIndicators: () => import('./_geo.vue'),
  },
};
</script>

<style lang="scss">
.admin-marketing-indicators {
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
