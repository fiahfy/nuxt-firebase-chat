<template>
  <app>
    <template slot="title">
      {{ title }}
    </template>

    <template slot="drawer">
      <v-list dense>
        <v-list-tile class="mt-3" @click="dialog = true">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">
            New room
          </v-list-tile-title>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">ROOMS</v-subheader>
        <v-list>
          <v-list-tile
            v-for="room in rooms"
            :key="room.id"
            :to="`/rooms?id=${room.id}`"
            :class="getListTileClasses(room.id)"
            active-class=""
          >
            <v-list-tile-title v-text="room.name" />
          </v-list-tile>
        </v-list>
      </v-list>

      <v-dialog v-model="dialog" persistent max-width="500px" @click.stop>
        <v-card>
          <v-card-title primary-title>Create new room</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.name"
                :rules="[
                  () => form.name.length > 0 || 'This field is required'
                ]"
                required
                type="text"
                label="name"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn flat @click.stop="dialog = false"> Cancel </v-btn>
            <v-btn
              :disabled="sending || !valid"
              flat
              color="primary"
              @click.stop="submit"
            >
              Create
            </v-btn>
          </v-card-actions>
          <v-progress-linear v-if="sending" :indeterminate="true" />
        </v-card>
      </v-dialog>
    </template>

    <nuxt-child slot="content" />
  </app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import App from '~/components/App'

export default {
  components: {
    App
  },
  middleware: ['authenticated'],
  async fetch({ store }) {
    await store.dispatch('room/fetchRooms')
  },
  data() {
    return {
      form: {
        name: ''
      },
      snackbar: {
        active: false,
        text: ''
      },
      valid: true,
      sending: false,
      dialog: false
    }
  },
  computed: {
    title() {
      return this.room ? this.room.name : ''
    },
    ...mapGetters({
      room: 'room/room',
      rooms: 'room/rooms'
    })
  },
  methods: {
    getListTileClasses(id) {
      return this.room
        ? {
            'primary--text': id === this.room.id
          }
        : null
    },
    async submit() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.sending = true
      try {
        const id = await this.createRoom({ name: this.form.name })
        this.$router.push(`/rooms?id=${id}`)
        this.dialog = false
        this.from.name = ''
        this.snackbar.text = 'New room created.'
      } catch (e) {
        this.snackbar.text = e.message
      }
      this.snackbar.active = true
      this.sending = false
    },
    ...mapActions({
      createRoom: 'room/createRoom'
    })
  }
}
</script>

<style scoped lang="scss">
.progress-linear {
  left: 0;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
