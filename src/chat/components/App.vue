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
      color="red"
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

      <div class="md-toolbar-section-end">
        <template v-if="isSignedIn">
          <md-button @click="goRooms">Rooms</md-button>
          <md-menu md-align-trigger>
            <md-avatar md-menu-trigger>
              <md-ripple>
                <img
                  v-if="user.photoUrl"
                  :src="user.photoUrl"
                  alt="menu"
                >
                <md-icon
                  v-else
                  class="md-size-2x"
                >account_circle</md-icon>
              </md-ripple>
            </md-avatar>
            <md-menu-content>
              <md-menu-item @click="logout">
                Sign out
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </template>
        <md-button
          v-else
          to="/login"
        >Sign in</md-button>
      </div>

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
    goRooms  () {
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
