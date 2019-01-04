<template>
  <v-navigation-drawer v-model="model" class="app-drawer" fixed clipped app>
    <v-list dense>
      <v-subheader class="grey--text text--darken-1">
        ROOMS
        <v-spacer />
        <v-btn
          flat
          icon
          class="ma-0"
          color="grey darken-1"
          @click="dialog = true"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
      </v-subheader>
      <v-list>
        <v-list-tile
          v-for="room in rooms"
          :key="room.id"
          :to="`/rooms?id=${room.id}`"
          :class="getListTileClasses(room.id)"
          active-class=""
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="room.name" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-list>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title primary-title>Create new room</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="form.name"
              :rules="[() => form.name.length > 0 || 'This field is required']"
              required
              type="text"
              label="name"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="dialog = false">Cancel</v-btn>
          <v-btn
            :disabled="sending || !valid"
            flat
            color="primary"
            @click="onSubmit"
          >
            Create
          </v-btn>
        </v-card-actions>
        <v-progress-linear v-if="sending" :indeterminate="true" />
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: null,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      sending: false,
      dialog: false,
      form: {
        name: ''
      }
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    ...mapGetters('room', ['room', 'rooms'])
  },
  async created() {
    await this.fetchRooms()
  },
  methods: {
    getListTileClasses(id) {
      return this.room
        ? {
            'primary--text': this.$route.name === 'rooms' && id === this.room.id
          }
        : null
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.sending = true
      try {
        const id = await this.createRoom({ name: this.form.name })
        this.form.name = ''
        this.dialog = false
        this.$router.push(`/rooms?id=${id}`)
      } catch (e) {
        //
      }
      this.sending = false
    },
    ...mapActions('room', ['fetchRooms', 'createRoom'])
  }
}
</script>

<style scoped lang="scss">
.v-progress-linear {
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
