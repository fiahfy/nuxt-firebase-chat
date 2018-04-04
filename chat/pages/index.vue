<template>
  <section>
    <div ref="message-container" class="message-container">
      <div class="spinner" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" />
      </div>
      <message v-else v-for="message of messages.slice().reverse()" :key="message.id" :message="message" />
    </div>
    <md-field>
      <md-textarea v-model="message" md-autogrow placeholder="Message..." @keydown="keydown"></md-textarea>
    </md-field>
  </section>
</template>

<script>
import Message from '~/components/Message.vue'

export default {
  components: {
    Message
  },
  data () {
    return {
      loading: true,
      messages: [],
      message: ''
    }
  },
  async mounted () {
    const r = await this.$auth.signInAnonymouslyAndRetrieveData()
    console.log(r.user.uid)

    this.unsubscribe = this.$db.collection('messages').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
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
        const container = this.$refs['message-container']
        container.scrollTop = container.scrollHeight
      })
    })
  },
  beforeDestroy () {
    this.unsubscribe()
  },
  methods: {
    async keydown (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.message.length) {
          return
        }
        try {
          await this.$db.collection('messages').add({
            message: this.message,
            createdAt: new Date
          })
          this.message = ''
        } catch (e) {
          throw e
        }
      }
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
.message-container {
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
