<template>
  <v-container fill-height fluid pa-0 scroll-y>
    <v-layout v-if="id" column>
      <v-spacer />
      <div v-if="loading" class="text-xs-center pa-3">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-card class="ma-4">
        <template v-if="messages.length">
          <message-list :messages="messages | reverse" />
          <v-divider />
        </template>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea
              v-model="form.message"
              label="Message"
              rows="1"
              auto-grow
              @keydown="onKeydown"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-layout v-else align-center justify-center>
      <v-flex>
        <div class="text-xs-center">
          <v-icon size="160" class="grey--text"> chat </v-icon>
          <p class="title">Enter room</p>
          <p class="subheading">
            Select a room you want to enter on the side menu.
          </p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import MessageList from '~/components/MessageList.vue'

export default {
  components: {
    MessageList
  },
  middleware: ['authenticated'],
  watchQuery: ['id'],
  async fetch({ error, query, store }) {
    const { id } = query
    if (!id) {
      return store.commit('room/setId', { id })
    }
    const room = await store.dispatch('room/fetchRoom', { id })
    if (!room) {
      return error({ statusCode: 404, message: 'Room Not Found' })
    }
    return store.commit('room/setId', { id })
  },
  filters: {
    reverse(value) {
      return value.slice().reverse()
    }
  },
  data() {
    return {
      valid: true,
      sending: false,
      loading: true,
      form: {
        message: ''
      }
    }
  },
  computed: {
    ...mapState('room', ['id']),
    ...mapGetters('room', ['messages'])
  },
  watch: {
    id() {
      this.load()
    },
    messages() {
      this.loading = false
      this.$nextTick(() => {
        this.$el.scrollTop = this.$el.scrollHeight
      })
    }
  },
  created() {
    this.load()
  },
  beforeDestroy() {
    this.unsubscribeMessages()
  },
  methods: {
    load() {
      this.unsubscribeMessages()
      if (!this.id) {
        return
      }
      this.loading = true
      this.subscribeMessages()
    },
    async onKeydown(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.form.message.length) {
          return
        }
        try {
          await this.createMessage({ message: this.form.message })
          this.form.message = ''
        } catch (e) {
          throw e
        }
      }
    },
    ...mapActions('room', [
      'subscribeMessages',
      'unsubscribeMessages',
      'createMessage'
    ])
  }
}
</script>
