<template>
  <v-navigation-drawer fixed v-model="isActive" left clipped app>
    <v-list two-line>
      <template v-for="(item, index) in members">
        <v-list-tile :key="index">
          <v-list-tile-avatar>
            <img :src="item.avatar" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.title }}
              <v-tooltip bottom v-if="item.isHost">
                <template v-slot:activator="{ on }">
                  <v-icon class="__icon" color="red" v-on="on">videocam</v-icon>
                </template>
                <span>Ведущий</span>
              </v-tooltip>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    isShowed: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    ...mapState(["members"]),

    isActive: {
      get() {
        return this.isShowed;
      },
      set(value) {
        this.$emit("toggle", value);
      }
    }
  },

  methods: {
    ...mapActions({
      fetchMembers: "FETCH_MEMBERS"
    })
  },

  mounted() {
    this.fetchMembers();
  }
};
</script>

<style lang="scss">
.__icon {
  position: absolute;
  right: 0;
}
</style>
