<template>
  <app no-toolbar>
    <v-container slot="content" fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg4>
          <v-card>
            <v-card-title primary-title>Sign in to Chat</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="form.email"
                  :rules="[
                    () => form.email.length > 0 || 'This field is required'
                  ]"
                  required
                  type="email"
                  label="Email"
                />
                <v-text-field
                  v-model="form.password"
                  :rules="[
                    () => form.password.length > 0 || 'This field is required'
                  ]"
                  required
                  label="Password"
                  type="password"
                />
                <small>
                  <nuxt-link to="/password-reset">Forgot password?</nuxt-link>
                </small>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="sending || !valid"
                block
                color="primary"
                @click="onSubmit"
              >
                Sign in
              </v-btn>
            </v-card-actions>
            <v-divider />
            <v-card-actions>
              <v-btn :disabled="sending" block @click="onSignInClick">
                Sign in with GitHub
              </v-btn>
            </v-card-actions>
            <v-progress-linear v-if="sending" :indeterminate="true" />
            <v-snackbar v-model="snackbar.active">
              {{ snackbar.text }}
            </v-snackbar>
          </v-card>
          <div class="description">
            <small>
              Don't have an account?
              <nuxt-link to="/register">Create an account</nuxt-link>
            </small>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </app>
</template>

<script>
import { mapActions } from 'vuex'
import App from '~/components/App'

export default {
  components: {
    App
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      snackbar: {
        active: false,
        text: ''
      },
      valid: true,
      sending: false
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.sending = true
      try {
        await this.signInWithEmailAndPassword({ ...this.form })
        this.$router.push('/rooms')
      } catch (e) {
        this.snackbar.active = true
        this.snackbar.text = e.message
        this.sending = false
      }
    },
    async onSignInClick() {
      this.sending = true
      try {
        await this.signInWithGithub()
        this.$router.push('/rooms')
      } catch (e) {
        this.snackbar.active = true
        this.snackbar.text = e.message
        this.sending = false
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
.v-progress-linear {
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.description {
  padding: 30px;
  text-align: center;
  a {
    white-space: nowrap;
  }
}
</style>
