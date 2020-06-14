<template>
  <admin-layout title="Карусель">
    <div v-if="isReflinksFetching || isMetaFetching">Загрузка...</div>

    <link-creator
      :is-active="isLinkCreatorOpened"
      :manager="linkCreatorManager"
      @close="isLinkCreatorOpened = false"
    />

    <text-editor v-if="!isMetaFetching && !isReflinksFetching" />

    <template v-for="(item, key) in managers" >
      <carousel-table
        v-if="!isMetaFetching && !isReflinksFetching"
        :key="`manager-${key}`"
        :manager-name="item.name"
        :manager-alias="item.alias"
        @open-link-creator="openLinkCreatorDialog(item)"
      />

      <hr v-if="!isMetaFetching && !isReflinksFetching" :key="`hr-${key}`">
    </template>

    <!-- <b-button
      type="is-danger"
      native-type="button"
      icon-left="cancel"
      @click="upload"
    >
      Загрузить в базу
    </b-button> -->
  </admin-layout>
</template>

<script>
// import db from '@/utils/firebase/init';
import { mapState, mapActions } from 'vuex';
import CarouselTable from './_table.vue';
import TextEditor from './_text-editor.vue';
import LinkCreator from './_link-creator.vue';

export default {
  name: 'AdminCarouselPage',

  usedVuexModules: ['admin'],

  components: {
    CarouselTable,
    TextEditor,
    LinkCreator,
  },

  data() {
    return {
      managers: [
        {
          name: 'Хан',
          alias: 'han',
        },
        {
          name: 'Мария',
          alias: 'maria',
        },
        {
          name: 'Станислав',
          alias: 'stanislav',
        },
        {
          name: 'Анна',
          alias: 'anna',
        },
        {
          name: 'Мадина',
          alias: 'madina',
        },
        {
          name: 'Пауль',
          alias: 'paul',
        },
        {
          name: 'Мухаметали',
          alias: 'muha',
        },
        {
          name: 'Юлия',
          alias: 'julia',
        },
        {
          name: 'Алина',
          alias: 'alina',
        },
      ],
      isLinkCreatorOpened: false,
      linkCreatorManager: {
        name: '',
        alias: '',
      },
      // links: {
      //   han: {
      //     101: 'https://t.me/coursenew_bot?start=612767161',
      //     102: 'https://t.me/coursenew_bot?start=765120265',
      //     103: 'https://t.me/coursenew_bot?start=825657001',
      //     104: 'https://t.me/coursenew_bot?start=1032490074',
      //     105: 'https://t.me/coursenew_bot?start=709268589',
      //     106: 'https://t.me/coursenew_bot?start=909234905',
      //     107: 'https://t.me/coursenew_bot?start=370589672',
      //     108: 'https://t.me/coursenew_bot?start=178580868',
      //   },
      //   maria: {
      //     201: 'https://t.me/coursenew_bot?start=753558174',
      //     202: 'https://t.me/coursenew_bot?start=1257894221',
      //     203: 'https://t.me/coursenew_bot?start=849277650 ',
      //     204: 'https://t.me/coursenew_bot?start=445121959',
      //     205: 'https://t.me/coursenew_bot?start=566959351',
      //     206: 'https://t.me/coursenew_bot?start=417180515',
      //     207: 'https://t.me/coursenew_bot?start=720152897',
      //     208: 'https://t.me/coursenew_bot?start=723199965',
      //     209: 'https://t.me/coursenew_bot?start=650669909',
      //     210: 'https://t.me/coursenew_bot?start=379698429',
      //     211: 'https://t.me/coursenew_bot?start=1095773168',
      //     212: 'https://t.me/coursenew_bot?start=895905379',
      //     213: 'https://t.me/coursenew_bot?start=833299298',
      //   },
      //   stanislav: {
      //     301: 'https://t.me/coursenew_bot?start=1199748872',
      //     302: 'https://t.me/coursenew_bot?start=717072576',
      //     303: 'https://t.me/coursenew_bot?start=398267073',
      //     304: 'https://t.me/coursenew_bot?start=1096098710',
      //     305: 'https://t.me/coursenew_bot?start=511876310',
      //     306: 'https://t.me/coursenew_bot?start=1027953135',
      //     307: 'https://t.me/coursenew_bot?start=406295763',
      //     308: 'https://t.me/coursenew_bot?start=355095830',
      //     309: 'https://t.me/coursenew_bot?start=492865407',
      //     310: 'https://t.me/coursenew_bot?start=1126739138',
      //     311: 'https://t.me/coursenew_bot?start=425838279',
      //     312: 'https://t.me/coursenew_bot?start=1151662732',
      //     313: 'https://t.me/coursenew_bot?start=403873089',
      //   },
      //   anna: {
      //     401: 'https://t.me/coursenew_bot?start=367991293',
      //     402: 'https://t.me/coursenew_bot?start=354600393',
      //     403: 'https://t.me/coursenew_bot?start=1085727506 ',
      //     404: 'https://t.me/coursenew_bot?start=825884058',
      //     405: 'https://t.me/coursenew_bot?start=402982529 ',
      //     406: 'https://t.me/coursenew_bot?start=552219643',
      //     407: 'https://t.me/coursenew_bot?start=364286416',
      //     408: 'https://t.me/coursenew_bot?start=1262691677',
      //     409: 'https://t.me/coursenew_bot?start=448682514 ',
      //     410: 'https://t.me/coursenew_bot?start=347654020',
      //   },
      //   madina: {
      //     501: 'https://t.me/coursenew_bot?start=161347595',
      //     502: 'https://t.me/coursenew_bot?start=161430015',
      //     503: 'https://t.me/coursenew_bot?start=264507724',
      //     504: 'https://t.me/coursenew_bot?start=469762170',
      //     505: 'https://t.me/coursenew_bot?start=1036431292',
      //   },
      //   paul: {
      //     601: 'https://t.me/coursenew_bot?start=499392432',
      //     602: 'https://t.me/coursenew_bot?start=1120591811',
      //     603: 'https://t.me/coursenew_bot?start=324741716',
      //     604: 'https://t.me/coursenew_bot?start=848078102',
      //     605: 'https://t.me/coursenew_bot?start=515537890',
      //     606: 'https://t.me/coursenew_bot?start=940892745',
      //     607: 'https://t.me/coursenew_bot?start=1048287327',
      //     608: 'https://t.me/coursenew_bot?start=1167696188',
      //     609: 'https://t.me/coursenew_bot?start=301428630',
      //     610: 'https://t.me/coursenew_bot?start=908183280',
      //     611: 'https://t.me/coursenew_bot?start=394403026',
      //     612: 'https://t.me/coursenew_bot?start=336765883',
      //     613: 'https://t.me/coursenew_bot?start=456724404',
      //     614: 'https://t.me/coursenew_bot?start=768725530',
      //     615: 'https://t.me/coursenew_bot?start=673085125',
      //     616: 'https://t.me/coursenew_bot?start=477669275',
      //   },
      //   muha: {
      //     701: 'https://t.me/coursenew_bot?start=1069570576',
      //     702: 'https://t.me/coursenew_bot?start=159138787',
      //     703: 'https://t.me/coursenew_bot?start=265633599',
      //     704: 'https://t.me/coursenew_bot?start=329320892',
      //     705: 'https://t.me/coursenew_bot?start=382723161',
      //     706: 'https://t.me/coursenew_bot?start=197724612',
      //     707: 'https://t.me/coursenew_bot?start=495921501',
      //     708: 'https://t.me/coursenew_bot?start=639286813',
      //   },
      //   julia: {
      //     801: 'https://t.me/coursenew_bot?start=382531525',
      //     802: 'https://t.me/coursenew_bot?start=543891010',
      //     803: 'https://t.me/coursenew_bot?start=977637429',
      //     804: 'https://t.me/coursenew_bot?start=323560647',
      //     805: 'https://t.me/coursenew_bot?start=406448928',
      //     806: 'https://t.me/coursenew_bot?start=159779271',
      //     807: 'https://t.me/coursenew_bot?start=404913659',
      //     808: 'https://t.me/coursenew_bot?start=464007370',
      //     809: 'https://t.me/coursenew_bot?start=520407870',
      //     810: 'https://t.me/coursenew_bot?start=351986320',
      //     811: 'https://t.me/coursenew_bot?start=343583959',
      //     812: 'https://t.me/coursenew_bot?start=1114786770',
      //     813: 'https://t.me/coursenew_bot?start=1246687633',
      //     814: 'https://t.me/coursenew_bot?start=544242574',
      //     815: 'https://t.me/coursenew_bot?start=1016991957',
      //     816: 'https://t.me/coursenew_bot?start=487519367',
      //     817: 'https://t.me/coursenew_bot?start=402789853',
      //     818: 'https://t.me/coursenew_bot?start=744697001',
      //     819: 'https://t.me/coursenew_bot?start=661336605',
      //   },
      //   alina: {
      //     901: 'https://t.me/coursenew_bot?start=1177345042',
      //     902: 'https://t.me/coursenew_bot?start=1108780533',
      //     903: 'https://t.me/coursenew_bot?start=1218394964',
      //     904: 'https://t.me/coursenew_bot?start=426198492',
      //     905: 'https://t.me/coursenew_bot?start=363458205',
      //     906: 'https://t.me/coursenew_bot?start=738751966',
      //     907: 'https://t.me/coursenew_bot?start=435503062',
      //     908: 'https://t.me/coursenew_bot?start=512678334',
      //   },
      // },
    };
  },

  computed: {
    ...mapState('admin/carousel', [
      'isMetaFetching',
      'isReflinksFetching',
      'metaFetchingError',
      'reflinksFetchingError',
    ]),
  },

  methods: {
    ...mapActions('admin/carousel', {
      fetchCarouselMeta: 'FETCH_CAROUSEL_META',
      fetchCarouselReflinks: 'FETCH_CAROUSEL_REFLINKS',
      fetchCarouselFinallinks: 'FETCH_CAROUSEL_FINALLINKS',
    }),

    openLinkCreatorDialog(manager) {
      this.linkCreatorManager = manager;
      this.isLinkCreatorOpened = true;
    },

    // upload() {
    //   const batch = db.batch();

    //   Object.keys(this.links).forEach((manager) => {
    //     Object.keys(this.links[manager]).forEach((index) => {
    //       const value = {
    //         manager,
    //         number: parseInt(index, 10),
    //         reflink: this.links[manager][index],
    //       };

    //       const docRef = db.collection('carousel_reflinks').doc();
    //       batch.set(docRef, value);
    //     });
    //   });

    //   return batch.commit()
    //     .then(() => console.log('Done!'));
    // },
  },

  mounted() {
    this.fetchCarouselMeta();
    this.fetchCarouselReflinks();
    this.fetchCarouselFinallinks();
  },
};
</script>
