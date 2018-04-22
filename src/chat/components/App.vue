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
        <span class="title">Chat</span>
      </v-toolbar-title>
      <v-spacer />

      <template v-if="isSignedIn">
        <v-btn
          flat
          to="/rooms"
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
              alt="user.name"
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
      <v-container fill-height>
        <slot name="content" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
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
