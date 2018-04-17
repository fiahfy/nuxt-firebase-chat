<template>
  <div class="md-layout md-alignment-center-center">
    <div class="md-layout-item md-xsmall-size-90">
      <md-card>
        <md-card-header>
          <div class="md-title">Sign up to Chat</div>
        </md-card-header>

        <form @submit.prevent="signUp">
          <md-card-content>
            <md-field>
              <label for="username">Username</label>
              <md-input
                v-model="form.username"
                :disabled="sending"
                type="text"
                name="username"
                autocomplete="username"
              />
            </md-field>
            <md-field>
              <label for="email">Email</label>
              <md-input
                v-model="form.email"
                :disabled="sending"
                type="email"
                name="email"
                autocomplete="email"
              />
            </md-field>
            <md-field>
              <label for="email">Password</label>
              <md-input
                v-model="form.password"
                :disabled="sending"
                type="password"
                name="password"
                autocomplete="current-password"
              />
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button
              :disabled="sending"
              type="submit"
              class="md-raised md-primary"
            >Sign up</md-button>
          </md-card-actions>
        </form>

        <md-progress-bar
          v-if="sending"
          md-mode="indeterminate"
        />
      </md-card>

      <md-snackbar :md-active.sync="active">{{ message }}</md-snackbar>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        email: null,
        password: null,
        username: null
      },
      sending: false,
      active: false,
      message: null
    }
  },
  methods: {
    async signUp () {
      this.sending = true
      try {
        await this.signUpWithEmailAndPassword({ ...this.form })
        this.$router.push('/rooms')
      } catch (e) {
        this.sending = false
        this.active = true
        this.message = e.message
      }
    },
    ...mapActions({
      signUpWithEmailAndPassword: 'signUpWithEmailAndPassword'
    })
  }
}
</script>

<style scoped lang="scss">
.md-layout {
  height: 100%;
  .md-layout-item {
    max-width: 380px;
    .md-button {
      width: 100%;
    }
    .md-progress-bar {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
    }
  }
}
</style>
