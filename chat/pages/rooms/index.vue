<template>
  <section>
    <div ref="messages" class="messages">
      <div class="spinner" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" />
      </div>
      <div v-else v-for="message of messages.slice().reverse()" :key="message.id">
        <message :message="message" />
        <md-divider />
      </div>
    </div>
    <md-field>
      <md-textarea v-model="message" md-autogrow placeholder="Message..." @keydown="keydown"></md-textarea>
    </md-field>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import Message from '~/components/Message.vue'

export default {
  components: {
    Message
  },
  watchQuery: ['id'],
  data () {
    return {
      id: '',
      loading: true,
      messages: [],
      message: ''
    }
  },
  asyncData({ query }) {
    console.log('async')
    return {
      id: query.id
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
      // await this.$db.collection('rooms').doc(this.id).set({})
      this.unsubscribe = this.$db.collection('rooms').doc(this.id).collection('messages').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        this.loading = false
        this.messages = [
          ...snapshot.docChanges.reduce((carry, change) => {
            if (change.type === 'added') {
              carry.push({
                id: change.doc.id, ...change.doc.data()
              })
            }
            return carry
          }, []),
          ...this.messages
        ]
        this.$nextTick(() => {
          const el = this.$refs['messages']
          el.scrollTop = el.scrollHeight
        })
      })
    },
    async keydown (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.message.length) {
          return
        }
        try {
          this.createMessage({ roomId: this.id, message: this.message })
          this.message = ''
        } catch (e) {
          throw e
        }
      }
    },
    ...mapActions({
      createMessage: 'createMessage'
    })
  },
  watch: {
    id () {
      this.load()
    }
  }
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  flex: 1;
  overflow: auto;
  .message {
    margin: 15px 0;
  }
  .spinner {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  }
}
</style>
