<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout row>
      <v-flex>
        <template v-if="id">
          <div
            ref="messages"
            class="messages"
          >
            <div class="message-filler" />
            <div
              v-if="loading"
              class="spinner"
            >
              <v-progress-circular indeterminate />
            </div>
            <message-list :messages="messages.slice().reverse()" />
          </div>
          <v-divider />
          <div class="actions">
            <!-- <md-field>
              <md-textarea
                v-model="message"
                md-autogrow
                placeholder="Message..."
                @keydown="onKeydown"
              />
            </md-field> -->
          </div>
        </template>
        <div v-else>
          <!-- <md-empty-state
            md-icon="chat"
            md-label="Enter room"
            md-description="Select a room you want to enter on the side menu."
          /> -->
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
      message: ''
    }
  },
  computed: {
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
