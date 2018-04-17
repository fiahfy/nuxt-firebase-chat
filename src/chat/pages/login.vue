<template>
  <div class="md-layout md-alignment-center-center">
    <div class="md-layout-item md-xsmall-size-90">
      <md-card>
        <md-card-header>
          <div class="md-title">Sign in to Chat</div>
        </md-card-header>

        <md-card-area>
          <form @submit.prevent="signIn">
            <md-card-content>
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
                <span class="md-helper-text">
                  <nuxt-link to="/password-reset">Forgot password?</nuxt-link>
                </span>
              </md-field>
            </md-card-content>

            <md-card-actions>
              <md-button
                :disabled="sending"
                type="submit"
                class="md-raised md-primary"
              >Sign in</md-button>
            </md-card-actions>
          </form>
        </md-card-area>

        <md-card-actions>
          <md-button
            :disabled="sending"
            type="button"
            class="md-raised md-default"
            @click="(e) => signIn('github')"
          >Sign in with GitHub</md-button>
        </md-card-actions>

        <md-progress-bar
          v-if="sending"
          md-mode="indeterminate"
        />
      </md-card>

      <md-snackbar :md-active.sync="active">{{ message }}</md-snackbar>

      <div class="description">
        Don't have an account? <nuxt-link to="/register">Create an account</nuxt-link>
      </div>
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
        password: null
      },
      sending: false,
      active: false,
      message: null
    }
  },
  methods: {
    async signIn (provider) {
      this.sending = true
      try {
        if (provider === 'github') {
          await this.signInWithGithub()
        } else {
          await this.signInWithEmailAndPassword({ ...this.form })
        }
        this.$router.push('/rooms')
      } catch (e) {
        this.sending = false
        this.active = true
        this.message = e.message
      }
    },
    ...mapActions({
      signInWithEmailAndPassword: 'signInWithEmailAndPassword',
      signInWithGithub: 'signInWithGithub'
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
    .description {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
