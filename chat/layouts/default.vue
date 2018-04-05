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
        Navigation
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>move_to_inbox</md-icon>
          <span class="md-list-item-text">Inbox</span>
        </md-list-item>

        <md-list-item>
          <md-icon>send</md-icon>
          <span class="md-list-item-text">Sent Mail</span>
        </md-list-item>

        <md-list-item>
          <md-icon>delete</md-icon>
          <span class="md-list-item-text">Trash</span>
        </md-list-item>

        <md-list-item>
          <md-icon>error</md-icon>
          <span class="md-list-item-text">Spam</span>
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
  computed: {
    ...mapState({
      user: 'user'
    }),
    ...mapGetters({
      isSignedIn: 'isSignedIn'
    })
  },
  methods: {
    ...mapActions({
      signIn: 'signIn',
      signOut: 'signOut'
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
