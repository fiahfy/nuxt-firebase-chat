export const state = () => ({
  id: null,
  rooms: {},
  messages: []
})

export const actions = {
  async fetchRoom ({ commit }, { id }) {
    const doc = await this.$db.collection('rooms').doc(id).get()
    if (!doc.exists) {
      return null
    }
    const room = { id: doc.id, ...doc.data() }
    commit('setRoom', { room })
    return room
  },
  async fetchRooms ({ commit }) {
    const rooms = []
    const snapshot = await this.$db.collection('rooms').orderBy('createdAt', 'asc').get()
    snapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() })
    })
    commit('setRooms', { rooms })
    return rooms
  },
  async createRoom ({ commit }, { name }) {
    const ref = await this.$db.collection('rooms').add({
      name,
      createdAt: new Date
    })
    const doc = await ref.get()
    const room = { id: doc.id, ...doc.data() }
    commit('setRoom', { room })
    return room.id
  },
  async createMessage ({ state, rootState }, { message }) {
    if (!state.id || !rootState.user) {
      return
    }
    const ref = await this.$db.collection('rooms').doc(state.id).collection('messages').add({
      message,
      createdAt: new Date,
      sender: rootState.user.uid,
      senderName: rootState.user.name,
      senderPhotoUrl: rootState.user.photoUrl
    })
  }
}

export const mutations = {
  setId (state, { id }) {
    state.id = id
  },
  setRoom (state, { room }) {
    state.rooms = {
      ...state.rooms,
      [room.id]: room
    }
  },
  setRooms (state, { rooms }) {
    state.rooms = {
      ...rooms.reduce((carry, room) => {
        carry[room.id] = room
        return carry
      }, state.rooms)
    }
  }
}

export const getters = {
  room (state) {
    return state.rooms[state.id]
  },
  rooms (state) {
    return Object.values(state.rooms).sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
  }
}
