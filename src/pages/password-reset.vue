<template>
  <app no-toolbar>
    <v-container slot="content" fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg4>
          <v-card>
            <v-card-title primary-title>Reset your password</v-card-title>
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
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="sending || !valid"
                block
                color="primary"
                @click="onSubmit"
              >
                Send
              </v-btn>
            </v-card-actions>
            <v-progress-linear v-if="sending" :indeterminate="true" />
            <v-snackbar v-model="snackbar.active">
              {{ snackbar.text }}
            </v-snackbar>
          </v-card>
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
        email: ''
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
        await this.sendPasswordResetEmail({ ...this.form })
        this.snackbar.text = 'Sent email to reset password.'
      } catch (e) {
        this.snackbar.text = e.message
      }
      this.snackbar.active = true
      this.sending = false
    },
    ...mapActions({
      sendPasswordResetEmail: 'sendPasswordResetEmail'
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
</style>
