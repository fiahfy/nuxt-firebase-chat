<template>
  <section>
    <div ref="message-container" class="message">
      <div class="offset" />
      <p v-for="message of messages.slice().reverse()" :key="message.id">{{ message.message }}</p>
    </div>
    <input type="text" @keyup="keyup" />
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      messages: []
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
    async keyup (e) {
      if (e.keyCode === 13) {
        try {
          await this.$db.collection('messages').add({
            message: e.target.value,
            created_at: new Date
          })
          e.target.value = ''
        } catch (e) {
          throw e
        }
      }
    }
  }
}
</script>

<style>
section {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.message {
  flex: 1;
  overflow: auto;
}
.message>p {
  padding: 8px;
  height: 100px;
}
</style>
