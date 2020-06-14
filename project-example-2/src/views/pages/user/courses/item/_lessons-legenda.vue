<template>
  <ul class="courses-item__legenda">
    <li class="courses-item__legenda-item courses-item__legenda-item_type_prev">
      <span>Пройденный раздел</span>
    </li>
    <li
      class="courses-item__legenda-item courses-item__legenda-item_type_current"
    >
      <span>Текущий открытый раздел</span>
    </li>
    <li class="courses-item__legenda-item courses-item__legenda-item_type_next">
      <span>Закрытый раздел</span>
    </li>
  </ul>
</template>

<style lang="scss">
.courses-item__legenda {
  list-style-type: square;
  font-size: 1.5rem;
  background-color: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  padding: 1rem 1rem 1rem 3rem;

  &-item {
    span {
      margin: 0;
      font-size: 1rem;
      line-height: 1rem;
    }

    &_type_prev {
      color: #1fa890;
    }

    &_type_current {
      color: #fa6801;
    }

    &_type_next {
      color: #34425a;
    }
  }
}
</style>
