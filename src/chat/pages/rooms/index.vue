<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      v-if="id"
      column
    >
      <v-spacer />
      <div
        v-if="loading"
        class="text-xs-center pa-3"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
      <v-card>
        <template v-if="reversedMessages.length">
          <message-list :messages="reversedMessages" />
          <v-divider />
        </template>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-model="form.message"
              type="text"
              label="Message"
              multi-line
              rows="1"
              @keydown.native="onKeydown"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-layout
      v-else
      align-center
      justify-center
    >
      <v-flex>
        <div class="text-xs-center">
          <v-icon
            size="160"
            class="grey--text"
          >chat</v-icon>
          <p class="title">Enter room</p>
          <p class="subheading">Select a room you want to enter on the side menu.</p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MessageList from '~/components/MessageList.vue'

export default {
  components: {
    MessageList
  },
  watchQuery: ['id'],
  async fetch({ error, store, query }) {
    const id = query.id
    if (!id) {
      return store.commit('room/setId', { id })
    }
    const room = await store.dispatch('room/fetchRoom', { id })
    if (!room) {
      return error({ statusCode: 404, message: 'Room Not Found' })
    }
    return store.commit('room/setId', { id })
  },
  data () {
    return {
      loading: true,
      messages: [],
      form: {
        message: ''
      },
      valid: true,
      sending: false
    }
  },
  computed: {
    reversedMessages () {
      return this.messages.slice().reverse()
    },
    ...mapState({
      id: state => state.room.id
    })
  },
  watch: {
    id () {
      this.load()
    },
    messages () {
      this.$nextTick(() => {
        scroll(0, document.body.scrollHeight)
      })
    }
  },
  async mounted () {
    await this.load()
  },
  beforeDestroy () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    async load() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      if (!this.id) {
        return
      }
      this.unsubscribe = this.$db.collection('rooms').doc(this.id).collection('messages').orderBy('createdAt', 'desc').onSnapshot({
        includeDocumentMetadataChanges: true
      }, (snapshot) => {
        this.loading = false
        this.messages = [
          ...snapshot.docChanges.reduce((carry, change) => {
            switch (change.type) {
              case 'added':
                carry.push({
                  id: change.doc.id, ...change.doc.data()
                })
                break
              case 'removed':
                this.messages = this.messages.filter((message) => message.id !== change.doc.id)
                break
            }
            return carry
          }, []),
          ...this.messages
        ]
      })
    },
    async onKeydown (e) {
      console.log(e)
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.message.length) {
          return
        }
        try {
          await this.createMessage({ message: this.message })
          this.message = ''
        } catch (e) {
          throw e
        }
      }
    },
    ...mapActions({
      createMessage: 'room/createMessage'
    })
  }
}
</script>
