<template>
  <v-app>
    <app-drawer v-model="drawer" />

    <v-toolbar color="primary" dark dense fixed clipped-left app>
      <v-toolbar-side-icon @click="drawer = !drawer" />

      <v-toolbar-title>
        <nuxt-link to="/" class="white--text">
          <span class="title">Chat</span>
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <v-menu v-if="isSignedIn" offset-y>
        <v-avatar slot="activator" size="32">
          <v-img v-if="user.photoUrl" :src="user.photoUrl" :alt="user.name" />
          <v-icon v-else size="32">account_circle</v-icon>
        </v-avatar>
        <v-list>
          <v-list-tile to="/profile">
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <v-list-tile @click="onSignOutClick">
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn v-else flat to="/login">Sign in</v-btn>
    </v-toolbar>

    <v-content class="fill-height"><nuxt /></v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AppDrawer from '~/components/AppDrawer'

export default {
  components: {
    AppDrawer
  },
  data() {
    return {
      drawer: null
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isSignedIn'])
  },
  methods: {
    async onSignOutClick() {
      await this.signOut()
      this.$router.push('/login')
    },
    ...mapActions(['signOut'])
  }
}
</script>

<style scoped lang="scss">
.v-toolbar__title a {
  text-decoration: none;
}
</style>
