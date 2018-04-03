<template>
  <section>
    <div ref="message-container" class="message-container">
      <div class="offset" />
      <message v-for="message of messages.slice().reverse()" :key="message.id" :message="message" />
    </div>
    <md-field>
      <md-textarea v-model="message" md-autogrow placeholder="Input message" @keydown="keydown"></md-textarea>
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
      messages: [],
      message: ''
    }
  },
  async mounted () {
    this.unsubscribe = this.$db.collection('messages').orderBy('created_at', 'desc').onSnapshot((snapshot) => {
        console.log(snapshot)
      let messages = []
      snapshot.docChanges.forEach((change) => {
        console.log(change.doc.data())
        if (change.type === 'added') {
          messages.push({
            id: change.doc.id, ...change.doc.data()
          })
        }
      })
      this.messages = [...messages, ...this.messages]
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
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        if (!this.message.length) {
          return
        }
        try {
          await this.$db.collection('messages').add({
            message: this.message,
            created_at: new Date
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
}
</style>
