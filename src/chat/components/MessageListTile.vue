<template>
  <v-list-tile
    avatar
    class="message-list-tile"
  >
    <v-list-tile-avatar>
      <img
        v-if="message.senderPhotoUrl"
        :src="message.senderPhotoUrl"
        :alt="message.senderName"
      >
      <v-icon v-else>account_circle</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>
        {{ message.senderName }} <span class="grey--text text--lighten-1">{{ datetime }}</span>
      </v-list-tile-title>
      <v-list-tile-sub-title>{{ message.message }}</v-list-tile-sub-title>
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
    datetime () {
      const date = this.message.createdAt
      if (!(date instanceof Date)) {
        return ''
      }
      return `${('00' + date.getHours()).slice(-2)}:${('00' + date.getMinutes()).slice(-2)}`
    }
  }
}
</script>
