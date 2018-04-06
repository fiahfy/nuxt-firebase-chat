<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <div class="md-toolbar-section-start">
        <span class="md-title">Chat</span>
      </div>
      <div class="md-toolbar-section-end">
        <template v-if="isSignedIn">
          <md-menu md-align-trigger>
            <md-avatar md-menu-trigger>
              <img :src="user.photoUrl" alt="avatar">
            </md-avatar>
            <md-menu-content>
              <md-menu-item @click="signOut">
                Sign out
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </template>
        <md-button v-else class="md-primary" @click="signIn">Sign in</md-button>
      </div>
    </md-app-toolbar>

    <md-app-drawer md-permanent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        Rooms
      </md-toolbar>

      <md-list>
        <md-list-item @click="createRoom">
          <span class="md-list-item-text">New room</span>
        </md-list-item>
        <md-list-item v-for="room of rooms" :key="room.id" @click="(e) => goRoom(room.id)">
          <span class="md-list-item-text">{{ room.id }}</span>
        </md-list-item>
        <md-list-item>
          <nuxt-link class="md-list-item-text" to="/">Top</nuxt-link>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content>
      <nuxt />
    </md-app-content>
  </md-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  async mounted () {
    await this.fetchRooms()
  },
  computed: {
    ...mapState({
      user: 'user',
      rooms: 'rooms'
    }),
    ...mapGetters({
      isSignedIn: 'isSignedIn'
    })
  },
  methods: {
    goRoom (id) {
      this.$router.push(`/rooms/?id=${id}`)
    },
    ...mapActions({
      signIn: 'signIn',
      signOut: 'signOut',
      fetchRooms: 'fetchRooms',
      createRoom: 'createRoom'
    })
  }
}
</script>

<style>
html {
  box-sizing: border-box;
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
html, body, #__nuxt, #__layout {
  height: 100%;
}
.md-app {
  height: 100%;
}
.md-drawer {
  width: 230px;
}
</style>
