export default {
  growthDatepickerEvents(state) {
    return Object.keys(state.growthIndicators).map((key) => {
      const thisYear = state.growthIndicators[key].year;
      const thisMonth = state.growthIndicators[key].month;
      const thisDay = state.growthIndicators[key].day;

      return {
        date: new Date(thisYear, thisMonth, thisDay),
        type: 'is-primary',
      };
    });
  },

  genderDatepickerEvents(state) {
    return Object.keys(state.genderIndicators).map(key => ({
      date: new Date(state.genderIndicators[key].createdAt.seconds * 1000),
      type: 'is-primary',
    }));
  },

  ageDatepickerEvents(state) {
    return Object.keys(state.ageIndicators).map(key => ({
      date: new Date(state.ageIndicators[key].createdAt.seconds * 1000),
      type: 'is-primary',
    }));
  },

  geoDatepickerEvents(state) {
    return Object.keys(state.geoIndicators).map((key) => {
      if (state.geoIndicators[key].createdAt) {
        return {
          date: new Date(state.geoIndicators[key].createdAt.seconds * 1000),
          type: 'is-primary',
        };
      }

      return null;
    }).filter(item => item);
  },
};
