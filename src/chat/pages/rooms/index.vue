<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      column
      fill-height
    >
      <template v-if="id">
        <v-flex>
          <v-layout column>
            <v-spacer />
            <v-flex
              v-if="loading"
              class="spinner"
            >
              <v-progress-circular indeterminate />
            </v-flex>
            <v-flex>
              <v-card v-if="reversedMessages.length">
                <message-list :messages="reversedMessages" />
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-card>
            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="form.message"
                  :rules="[() => form.message.length > 0 || 'This field is required']"
                  required
                  type="text"
                  label="Message"
                  @keydown="onKeydown"
                />
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </template>
      <v-flex
        v-else
      >
        <!-- <md-empty-state
          md-icon="chat"
          md-label="Enter room"
          md-description="Select a room you want to enter on the side menu."
        /> -->
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
        const el = this.$refs['messages']
        if (!el) {
          return
        }
        el.scrollTop = el.scrollHeight
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

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  height: 100%;
  .messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    .message-filler {
      flex-grow: 1;
    }
    .message {
      margin: 15px;
    }
    .spinner {
      margin: 0 auto;
    }
  }
  .actions {
    padding: 0 15px;
  }
}
</style>
