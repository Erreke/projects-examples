export default {
  comments(state) {
    const items = {};

    const sortedKeys = Object.keys(state.comments).sort((a, b) => {
      return (
        state.comments[a].createdAt.seconds -
        state.comments[b].createdAt.seconds
      );
    });

    sortedKeys.forEach(item => {
      items[item] = state.comments[item];
    });

    return items;
  }
};
