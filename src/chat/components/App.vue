<template>
  <md-app
    md-waterfall
    md-mode="fixed"
  >
    <md-app-toolbar class="md-primary">
      <div class="md-toolbar-section-start">
        <template v-if="hasDrawer">
          <md-button
            class="md-icon-button menu"
            @click="active = !active"
          >
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">
            <slot name="title" />
          </span>
        </template>
        <template v-else>
          <md-button
            class="md-icon-button"
            to="/"
          >
            <md-icon>chat</md-icon>
          </md-button>
          <span class="md-title">Chat</span>
        </template>
      </div>
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
    </md-app-toolbar>

    <md-app-drawer
      v-if="hasDrawer"
      :md-active.sync="active"
      md-permanent="full"
    >
      <slot name="drawer" />
    </md-app-drawer>

    <md-app-content>
      <slot name="content" />
    </md-app-content>
  </md-app>
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

<style scoped lang="scss">
@import "~vue-material/src/components/MdLayout/mixins.scss";

.md-app {
  height: 100%;
  .md-toolbar-section-start {
    overflow: hidden;
    .menu {
      display: none;
      @include md-layout-xsmall {
        display: inline-block;
      }
    }
  }
  .md-app-drawer {
    display: flex;
    flex-direction: column;
    width: 230px;
  }
  .md-app-content {
    padding: 0;
  }
}
</style>
