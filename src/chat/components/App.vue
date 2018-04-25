<template>
  <v-app>
    <v-navigation-drawer
      v-if="hasDrawer"
      v-model="active"
      fixed
      clipped
      app
    >
      <slot name="drawer" />
    </v-navigation-drawer>

    <v-toolbar
      v-if="!noToolbar"
      color="blue"
      dark
      dense
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon
        v-if="hasDrawer"
        @click.stop="active = !active"
      />

      <v-toolbar-title class="mr-5 align-center">
        <nuxt-link
          to="/"
          class="white--text"
        >
          <span class="title">Chat</span>
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <template v-if="isSignedIn">
        <v-btn
          flat
          @click="goRoom"
        >Rooms</v-btn>
        <v-menu
          bottom
          left
        >
          <v-avatar
            slot="activator"
            size="32"
          >
            <img
              v-if="user.photoUrl"
              :src="user.photoUrl"
              :alt="user.name"
            >
            <v-icon v-else>account_circle</v-icon>
          </v-avatar>
          <v-list>
            <v-list-tile @click="logout">
              <v-list-tile-title>Sign out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
      <v-btn
        v-else
        flat
        to="/login"
      >Sign in</v-btn>
    </v-toolbar>

    <v-content>
      <slot name="content" />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
    noToolbar: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    hasDrawer () {
      return !!this.$slots['drawer']
    },
    ...mapState({
      user: 'user'
    }),
    ...mapGetters({
      isSignedIn: 'isSignedIn'
    })
  },
  methods: {
    goRoom () {
      this.$router.push('/rooms')
    },
    async logout () {
      await this.signOut()
      this.$router.push('/login')
    },
    ...mapActions({
      signOut: 'signOut'
    })
  }
}
</script>

<style scoped lang="scss">
.toolbar__title a {
  text-decoration: none;
}
</style>
