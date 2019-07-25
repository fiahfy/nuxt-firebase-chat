let unsubscribe = null

export const state = () => ({
  id: null,
  rooms: {},
  messages: {}
})

export const actions = {
  async fetchRoom({ commit }, { id }) {
    const doc = await this.$db
      .collection('rooms')
      .doc(id)
      .get()
    if (!doc.exists) {
      return null
    }
    const room = { id: doc.id, ...doc.data() }
    commit('setRoom', { room })
    return room
  },
  async fetchRooms({ commit }) {
    const query = await this.$db
      .collection('rooms')
      .orderBy('createdAt', 'asc')
      .get()
    const rooms = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
    commit('setRooms', { rooms })
    return rooms
  },
  async createRoom({ commit }, { name }) {
    const docRef = await this.$db.collection('rooms').add({
      name,
      createdAt: new Date()
    })
    const doc = await docRef.get()
    const room = { id: doc.id, ...doc.data() }
    commit('setRoom', { room })
    return room.id
  },
  subscribeMessages({ state, commit, dispatch }) {
    dispatch('unsubscribeMessages')
    commit('setMessages', { messages: [] })
    unsubscribe = this.$db
      .collection('rooms')
      .doc(state.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((query) => {
        const messages = query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        commit('setMessages', { messages })
      })
  },
  unsubscribeMessages() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  },
  async createMessage({ state, rootState }, { message }) {
    if (!state.id || !rootState.user) {
      return
    }
    await this.$db
      .collection('rooms')
      .doc(state.id)
      .collection('messages')
      .add({
        message,
        createdAt: new Date(),
        sender: rootState.user.uid,
        senderName: rootState.user.name,
        senderPhotoUrl: rootState.user.photoUrl
      })
  }
}

export const mutations = {
  setId(state, { id }) {
    state.id = id
  },
  setRoom(state, { room }) {
    state.rooms = {
      ...state.rooms,
      [room.id]: room
    }
  },
  setRooms(state, { rooms }) {
    state.rooms = {
      ...rooms.reduce((carry, room) => {
        return {
          ...carry,
          [room.id]: room
        }
      }, {})
    }
  },
  setMessages(state, { messages }) {
    state.messages = {
      ...messages.reduce((carry, message) => {
        return {
          ...carry,
          [message.id]: message
        }
      }, {})
    }
  }
}

export const getters = {
  room(state) {
    return state.rooms[state.id]
  },
  rooms(state) {
    return Object.values(state.rooms).sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1
    )
  },
  messages(state) {
    return Object.values(state.messages).sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1
    )
  }
}
