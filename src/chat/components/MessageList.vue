<template>
  <v-list
    two-line
    class="message-list"
  >
    <template v-for="(message, index) of messages">
      <v-divider
        v-if="index !== 0"
        :key="index"
        inset
      />
      <message-list-tile
        :message="message"
        :key="message.id"
      />
    </template>
  </v-list>
</template>

<script>
import MessageListTile from '~/components/MessageListTile.vue'

export default {
  components: {
    MessageListTile
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  }
}
</script>
