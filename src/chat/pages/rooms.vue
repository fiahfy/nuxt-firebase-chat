<template>
  <app>
    <template slot="title">
      {{ title }}
    </template>

    <template slot="drawer">
      <md-toolbar
        class="md-primary"
        md-elevation="0"
      >
        <md-button
          class="md-icon-button"
          to="/"
        >
          <md-icon>chat</md-icon>
        </md-button>
        <span class="md-title">Chat</span>
      </md-toolbar>

      <md-list>
        <md-list-item @click="showPrompt">
          <md-icon>add</md-icon>
          <span class="md-list-item-text">New room</span>
        </md-list-item>
        <md-divider />
        <md-list-item
          v-for="room of rooms"
          :key="room.id"
          :to="`/rooms?id=${room.id}`"
          :class="getItemClasses(room.id)"
        >
          <span class="md-list-item-text">{{ room.name }}</span>
        </md-list-item>
      </md-list>

      <md-dialog-prompt
        :md-active.sync="active"
        v-model="value"
        md-title="Create new room"
        md-input-maxlength="30"
        md-input-placeholder="Type room name..."
        md-confirm-text="Create"
        @md-confirm="confirm"
      />
    </template>

    <nuxt-child slot="content" />
  </app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import App from '~/components/App'

export default {
  components: {
    App
  },
  middleware: ['authenticated'],
  async fetch({ store }) {
    await store.dispatch('room/fetchRooms')
  },
  data () {
    return {
      active: false,
      value: null
    }
  },
  computed: {
    title () {
      return this.room ? this.room.name : ''
    },
    ...mapGetters({
      room: 'room/room',
      rooms: 'room/rooms'
    })
  },
  methods: {
    getItemClasses (id) {
      return this.room ? {
        'md-selected': id === this.room.id
      } : null
    },
    showPrompt () {
      this.active = true
    },
    async confirm () {
      if (!this.value) {
        return
      }
      const id = await this.createRoom({ name: this.value })
      this.$router.push(`/rooms?id=${id}`)
      this.value = ''
    },
    ...mapActions({
      createRoom: 'room/createRoom'
    })
  }
}
</script>

<style scoped lang="scss">
.md-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 0;
  .md-divider {
    min-height: 1px;
  }
}
</style>
