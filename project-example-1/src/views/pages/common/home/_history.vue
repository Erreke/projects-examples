<template>
  <div class="vc_row wpb_row vc_row-fluid wpb_animate_when_almost_visible fadeIn
   vc_row-has-fill hide_bg_image_on_mobile wpb_start_animation animated history">
    <div class="wpb_column vc_column_container vc_col-sm-12 sc_layouts_column_icons_position_left">
      <div class="vc_column-inner">
        <div class="wpb_wrapper">
          <div class="sc_title color_style_default sc_title_accent">
            <h1 class="sc_item_title sc_title_title sc_align_center sc_item_title_style_accent
             sc_item_title_tag header">Путь развития 2017-2020</h1>
            <div class="sc_item_descr sc_title_descr sc_align_center">
              <p>Что мы сделали и какие наши ближайшие планы</p>
            </div>
          </div>
          <div class="cq-timeline cq-timeline-border-small cq-timeline-round-small
           cq-timeline-move cq-timeline-borderaqua">
            <ul class="cq-timeline-list">
              <li class="cq-timeline-row cq-timeline-style-aqua"
               v-for="(item, key) in items" :key="key">
                <div class="cq-timeline-item">
                  <div class="cq-timeline-contentcontainer">
                    <div class="cq-timeline-content">
                      <h4 class="cq-timeline-title history__title">{{ item.title }}</h4>
                      <p class="cq-timeline-text"></p>
                      <p v-html="item.text"></p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageHistory',

  data() {
    return {
      items: [
        {
          title: 'Ноябрь 2017 года',
          text: 'погружение на шесть месяцев в индустрию<br> онлайн бизнеса для изучения проблем',
        },
        {
          title: 'Май 2018 года',
          text: 'начало разработки<br> сервиса AUTOMATON',
        },
        {
          title: 'Август 2018 года',
          text: 'первое партнерство<br> с Taklimakan Network',
        },
        {
          title: 'Ноябрь 2018 года',
          text: 'запуск бета-версии<br> AUTOMATON<br> и первые клиенты',
        },
        {
          title: 'Март 2019 года',
          text: 'партнерство с европейской<br> компанией INSTIME',
        },
        {
          title: 'Апрель 2019 года',
          text: 'официальный запуск<br> AUTOMATON',
        },
        {
          title: 'Май 2019 года',
          text: 'начало работы<br> с INSTIME',
        },
        {
          title: 'Июнь 2019 года',
          text: 'рост продаж<br> в INSTIME',
        },
        {
          title: 'Сентябрь 2019 года',
          text: 'первые довольные<br> клиенты',
        },
        {
          title: 'Октябрь 2019 года',
          text: 'запуск агентского<br> подразделения',
        },
        {
          title: 'Декабрь 2019 года',
          text: 'подготовка к масштабированию<br> через медийные каналы',
        },
        {
          title: 'Январь 2020 года',
          text: 'начало работы<br>с медийными личностями',
        },
        {
          title: 'Февраль 2020 года',
          text: 'подготовка перед запуском<br> франчайзинговой сети',
        },
        {
          title: 'Март 2020 года',
          text: 'открытие офисов<br> в странах СНГ',
        },
      ],
    };
  },
};
</script>
