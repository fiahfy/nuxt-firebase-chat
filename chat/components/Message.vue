<template>
  <md-content class="message">
    <md-avatar class="md-avatar-icon">A</md-avatar>
    <div class="container">
      <div>
        <span class="md-body-2">Ada Lovelace</span>
        <span class="md-caption">{{ datetime }}</span>
      </div>
      <p class="md-body-1">{{ message.message }}</p>
    </div>
  </md-content>
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

<style scoped lang="scss">
.message {
  display: flex;
  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 15px;
    div .md-caption {
      margin-left: 10px;
    }
    p {
      flex: 1;
    }
  }
}
</style>
