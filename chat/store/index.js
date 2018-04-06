import firebase from 'firebase'

export const state = () => ({
  user: null,
  rooms: []
})

export const actions = {
  async signIn ({ commit }) {
    const provider = new firebase.auth.GithubAuthProvider()
    await this.$auth.signInWithPopup(provider)
  },
  async signOut () {
    await this.$auth.signOut()
  },
  async fetchRooms ({ commit }) {
    const snapshot = await this.$db.collection('rooms').orderBy('createdAt', 'asc').get()
    const rooms = []
    snapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() })
    })
    commit('setRooms', { rooms })
  },
  async createRoom ({ dispatch }) {
    const doc = await this.$db.collection('rooms').add({
      createdAt: new Date
    })
    const snapshot = await doc.get()
    const room = snapshot.data()
    console.log(room)
    await dispatch('fetchRooms')
  },
  async createMessage ({ state }, { roomId, message }) {
    await this.$db.collection('rooms').doc(roomId).collection('messages').add({
      message,
      createdAt: new Date,
      sender: state.user.uid,
      senderName: state.user.name,
      senderPhotoUrl: state.user.photoUrl
    })
  }
}

export const mutations = {
  setUser (state, { user }) {
    state.user = user
  },
  setRooms (state, { rooms }) {
    state.rooms = rooms
  }
}

export const getters = {
  isSignedIn (state) {
    return !!state.user
  }
}
