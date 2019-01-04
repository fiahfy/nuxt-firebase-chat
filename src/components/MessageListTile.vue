<template>
  <v-list-tile class="message-list-tile" avatar>
    <v-list-tile-avatar>
      <v-img
        v-if="message.senderPhotoUrl"
        :src="message.senderPhotoUrl"
        :alt="message.senderName"
      />
      <v-icon v-else size="40">account_circle</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>
        {{ message.senderName }}
        <small class="ml-1 grey--text">{{ datetime }}</small>
      </v-list-tile-title>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <v-list-tile-sub-title v-html="html" />
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    datetime() {
      const date = this.message.createdAt.toDate()
      if (!(date instanceof Date)) {
        return ''
      }
      return `${('00' + date.getHours()).slice(-2)}:${(
        '00' + date.getMinutes()
      ).slice(-2)}`
    },
    html() {
      return this.message.message
        .replace(/<[^>]+>/g, '')
        .replace(/\n/g, '<br />')
    }
  }
}
</script>
