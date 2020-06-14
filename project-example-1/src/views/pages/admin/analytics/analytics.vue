<template>
  <admin-layout>
    <div class="admin">
      <h1 class="title">{{ $t('page-admin-analytics.title') }}</h1>

      <pre>
        1. общее количество клиентов
        2. общее количество агентов
        3. общее количество франчайзи
        4. количество клиентов по статусам
        5. финансы:
            1. сумма всех всего заработано
            2. сумма всех текущих балансов
            3. сумма всех всего заработано агентских
            4. сумма всех текущих балансов агентских
            5. сумма всех запросов на вывод
            6. сумма всех одобренных выводов
            7. сумма всех отправленных переводов
                1. одобренных
                2. отклоненных
            8. сумма всех полученных переводов
                1. одобренных
                2. отклоненных
        6. бизнес-места:
            1.  общее количество
            2. количество по пакетам
            3. продано общее количественно
            4. продано по пакетам количественно
            5. не продано общее количественно
            6. не продано по пакетам количественно
            7. стоимость всех пакетов
            8. стоимость пакетов по-отдельности
            9. стоимость проданных всех пакетов
            10. стоимость проданных пакетов по-отдельности
            11. стоимость не проданных всех пакетов
            12. стоимость не проданных пакетов по-отдельности
            13. сумма всех скидок
            14. сумма скидок по пакетам по-отдельности
            15. бизнес-место истечет:
                1. в течение месяца
                2. на этой неделе
      </pre>

      <div class="tile is-ancestor">
        <div class="tile is-vertical is-8">
          <div class="tile">
            <div class="tile is-parent is-vertical">
              <article class="tile is-child notification is-primary">
                <p class="title">{{ clientsAllCount | number_format }}</p>
                <p class="subtitle">Пользователей</p>
              </article>
              <article class="tile is-child notification is-warning">
                <p class="title">25</p>
                <p class="subtitle">Агентов</p>
              </article>
              <article class="tile is-child notification is-info">
                <p class="title">2</p>
                <p class="subtitle">Франчайзи</p>
              </article>
            </div>
            <div class="tile is-parent">
              <article class="tile is-child notification is-danger">
                <p class="title">Middle tile</p>
                <p class="subtitle">With an image</p>
                <figure class="image is-4by3">
                  <img src="https://bulma.io/images/placeholders/640x480.png">
                </figure>
              </article>
            </div>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-danger">
              <p class="title">Wide tile</p>
              <p class="subtitle">Aligned with the right tile</p>
              <div class="content">
                <!-- Content -->
              </div>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-success">
            <div class="content">
              <p class="title">Tall tile</p>
              <p class="subtitle">With even more content</p>
              <div class="content">
                <!-- Content -->
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AdminAnalyticsPage',

  computed: {
    ...mapGetters('admin/clients', ['clientsAllCount']),
  },
};
</script>
