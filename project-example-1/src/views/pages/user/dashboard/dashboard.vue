<template>
  <user-layout>
    <div class="dashboard">
      <user-balances
        v-if="$_user && $_user.createdAt && $_user.createdAt.seconds < 1588164820"
        :agent-balance="agentBalance"
        :agent-earned="agentEarned"
        :is-loading="isFinancesLoading"
      />

      <b-collapse :open="true" class="dashboard__collapse">
        <div class="content" slot="trigger" slot-scope="props" >
          <h2 class="subtitle">
            <span>{{ $t('page-dashboard.marketing-metrics') }}</span>
            <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
          </h2>
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child notification">
              <area-chart
                :title="$t('page-dashboard.growth')"
                :data="growthAreaChartData"
                :is-loading="isGrowthFetchingProcess"
              />
            </div>
          </div>

          <div class="tile is-parent">
            <div class="tile is-child notification">
              <pie-chart
                :title="$t('page-dashboard.gender')"
                :data="genderPieChartData"
                :is-loading="isGenderFetchingProcess"
                :no-data-text="$t('page-dashboard.no-data')"
              />
            </div>
          </div>
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child notification">
              <bar-chart
                :title="$t('page-dashboard.top-geography')"
                :data="geoBarChartData"
                :is-loading="isGeoFetchingProcess"
                :no-data-text="$t('page-dashboard.no-data')"
              />
            </div>
          </div>

          <div class="tile is-parent">
            <div class="tile is-child notification">
              <bar-chart
                :title="$t('page-dashboard.age')"
                :data="ageBarChartData"
                :is-loading="isAgeFetchingProcess"
                :no-data-text="$t('page-dashboard.no-data')"
              />
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </user-layout>
</template>

<script>
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/tooltip';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'DashboardPage',

  usedVuexModules: [
    'user',
    'finance',
    'marketing-indicators',
  ],

  components: {
    AreaChart: () => import('@/views/blocks/charts/_area-chart.vue'),
    PieChart: () => import('@/views/blocks/charts/_pie-chart.vue'),
    BarChart: () => import('@/views/blocks/charts/_bar-chart.vue'),
    UserBalances: () => import('./_user-balances'),
  },

  computed: {
    ...mapState('finance', {
      isFinancesLoading: 'isLoading',
    }),

    ...mapState('marketing-indicators', [
      'isGrowthFetchingProcess',
      'isGenderFetchingProcess',
      'isAgeFetchingProcess',
      'isGeoFetchingProcess',
    ]),

    ...mapGetters('finance', [
      'agentBalance',
      'agentEarned',
    ]),

    ...mapGetters('marketing-indicators', [
      'growthAreaChartData',
      'genderPieChartData',
      'ageBarChartData',
      'geoBarChartData',
    ]),
  },

  methods: {
    ...mapActions('finance', {
      fetchFinances: 'FETCH_FINANCES',
    }),

    ...mapActions('marketing-indicators', {
      fetchGrowthIndicators: 'FETCH_GROWTH_INDICATORS',
      fetchGenderIndicators: 'FETCH_GENDER_INDICATORS',
      fetchAgeIndicators: 'FETCH_AGE_INDICATORS',
      fetchGeoIndicators: 'FETCH_GEO_INDICATORS',
    }),
  },

  mounted() {
    this.fetchFinances(this.$_user.uid);
    this.fetchGrowthIndicators();
    this.fetchGenderIndicators();
    this.fetchAgeIndicators();
    this.fetchGeoIndicators();
  },
};
</script>

<style lang="scss">
.dashboard {
  padding-bottom: 3rem;

  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
