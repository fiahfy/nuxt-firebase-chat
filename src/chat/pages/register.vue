<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card>
              <v-card-title primary-title>Sign up to Chat</v-card-title>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="form.username"
                    :rules="[() => form.username.length > 0 || 'This field is required']"
                    required
                    type="text"
                    label="Username"
                  />
                  <v-text-field
                    v-model="form.email"
                    :rules="[() => form.email.length > 0 || 'This field is required']"
                    required
                    type="email"
                    label="Email"
                  />
                  <v-text-field
                    v-model="form.password"
                    :rules="[() => form.password.length > 0 || 'This field is required']"
                    required
                    label="Password"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="sending || !valid"
                  block
                  color="primary"
                  @click="submit"
                >Sign up</v-btn>
              </v-card-actions>
              <v-progress-linear
                v-if="sending"
                :indeterminate="true"
              />
              <v-snackbar v-model="snackbar.active">{{ snackbar.text }}</v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        username: '',
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
    async submit () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.sending = true
      try {
        await this.signUpWithEmailAndPassword({ ...this.form })
        this.$router.push('/rooms')
      } catch (e) {
        this.snackbar.active = true
        this.snackbar.text = e.message
        this.sending = false
      }
    },
    ...mapActions({
      signUpWithEmailAndPassword: 'signUpWithEmailAndPassword'
    })
  }
}
</script>

<style scoped lang="scss">
.progress-linear {
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
