<template>
  <div class="message">
    <md-avatar class="md-avatar-icon">A</md-avatar>
    <p>{{ message.message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.message {
  display: flex;
  p {
    flex: 1;
    line-height: 40px;
    margin-left: 15px;
  }
}
</style>
