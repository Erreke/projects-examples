import {
  CHART_COLORS,
  AGE_UNDER_18_INDEX,
  AGE_BETWEEN_18_25_INDEX,
  AGE_BETWEEN_26_35_INDEX,
  AGE_BETWEEN_36_55_INDEX,
  AGE_BETWEEN_56_85_INDEX,
  AGE_MORE_85_INDEX,
  AGE_UNKNOWN_INDEX,
} from '@/config';
import createI18n from '@/i18n';

const i18n = createI18n();

export default {
  growthAreaChartData(state) {
    const xAxis = [];
    const series = [];

    const keys = Object.keys(state.growthIndicators).reverse();

    keys.forEach((key) => {
      const item = state.growthIndicators[key];
      let { day, month } = item;

      if (day < 10) {
        day = `0${day}`;
      }

      if (month < 10) {
        month = `0${month + 1}`;
      } else {
        month += 1;
      }

      xAxis.push(`${day}.${month}`);
      series.push(item.value);
    });

    return {
      xAxis,
      series,
    };
  },

  genderPieChartData(state) {
    const last = state.growthIndicators[Object.keys(state.growthIndicators)[0]];

    if (last) {
      const { value } = last;

      const femaleCount = Math.floor(value / 100 * state.genderIndicator.female);
      const maleCount = value - femaleCount;

      return [
        {
          name: i18n.t('block-global.gender-female'),
          value: femaleCount,
        },
        {
          name: i18n.t('block-global.gender-male'),
          value: maleCount,
        },
      ];
    }

    return [];
  },

  ageBarChartData(state) {
    const last = state.growthIndicators[Object.keys(state.growthIndicators)[0]];

    if (last) {
      const { value } = last;

      const under18 = Math.floor(value / 100 * state.ageIndicator.under18);
      const between1825 = Math.floor(value / 100 * state.ageIndicator.between1825);
      const between2635 = Math.floor(value / 100 * state.ageIndicator.between2635);
      const between3655 = Math.floor(value / 100 * state.ageIndicator.between3655);
      const between5685 = Math.floor(value / 100 * state.ageIndicator.between5685);
      const more85 = Math.floor(value / 100 * state.ageIndicator.more85);

      // eslint-disable-next-line max-len
      const unknownAge = value - (under18 + between1825 + between2635 + between3655 + between5685 + more85);

      return [
        {
          name: '< 18',
          type: 'bar',
          barGap: 0,
          data: [under18],
          color: CHART_COLORS[AGE_UNDER_18_INDEX],
        },
        {
          name: '18-25',
          type: 'bar',
          barGap: 0,
          data: [between1825],
          color: CHART_COLORS[AGE_BETWEEN_18_25_INDEX],
        },
        {
          name: '26-35',
          type: 'bar',
          barGap: 0,
          data: [between2635],
          color: CHART_COLORS[AGE_BETWEEN_26_35_INDEX],
        },
        {
          name: '36-55',
          type: 'bar',
          barGap: 0,
          data: [between3655],
          color: CHART_COLORS[AGE_BETWEEN_36_55_INDEX],
        },
        {
          name: '56-85',
          type: 'bar',
          barGap: 0,
          data: [between5685],
          color: CHART_COLORS[AGE_BETWEEN_56_85_INDEX],
        },
        {
          name: '85 <',
          type: 'bar',
          barGap: 0,
          data: [more85],
          color: CHART_COLORS[AGE_MORE_85_INDEX],
        },
        {
          name: i18n.t('block-global.undefined'),
          type: 'bar',
          barGap: 0,
          data: [unknownAge],
          color: CHART_COLORS[AGE_UNKNOWN_INDEX],
        },
      ];
    }

    return [];
  },

  geoBarChartData(state) {
    const last = state.growthIndicators[Object.keys(state.growthIndicators)[0]];

    if (last) {
      const { value: lastGrowthValue } = last;
      const { keys, values } = state.geoIndicator;

      if (keys && values) {
        return keys.map((key, index) => {
          const value = Math.floor(lastGrowthValue / 100 * values[index]);

          return {
            name: key,
            type: 'bar',
            barGap: 0,
            data: [value],
            color: CHART_COLORS[index],
          };
        });
      }

      return [];
    }

    return [];
  },
};
