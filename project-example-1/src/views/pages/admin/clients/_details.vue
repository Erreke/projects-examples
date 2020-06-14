<template>
  <div class="admin-clients__details">
    <pseudo-table
      :label="$t('page-admin-clients.sm-th-uid')"
      :value="client.uid"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-bonus-holder-id')"
      :value="client.bonusHolderId"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-bonus-holder-nick')"
      :value="client.bonusHolderNick"
    />

    <hr>

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-first-name')"
      :value="client.firstName"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-second-name')"
      :value="client.secondName"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-birthday')"
      :value="client.birthday"
      field-type="date"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-email')"
      :value="client.email"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-phone')"
      :value="client.phone"
    />

    <hr>

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-gender')"
      :value="client.gender ? $t(`page-admin-clients.sm-td-gender-${client.gender}`) : '-'"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-nickname')"
      :value="client.nickname"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-country')"
      :value="client.country"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-region')"
      :value="client.region"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-city')"
      :value="client.city"
    />

    <hr>

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-registered-at')"
      :value="client.createdAt"
      field-type="datetime"
    />

    <pseudo-table
      :label="$t('page-admin-clients.sm-th-discount-deadline')"
      :value="discounts[client.uid] ? discounts[client.uid].deadline : null"
      field-type="datetime"
    />
  </div>
</template>

<script>
export default {
  components: {
    PseudoTable: () => import('@/views/blocks/pseudo-table.vue'),
  },

  props: {
    client: {
      type: Object,
      required: true,
    },

    discounts: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.admin-clients__details {
  flex: 1 1 60%;
  padding: 2rem;
  background-color: #fafafa;
}
</style>
