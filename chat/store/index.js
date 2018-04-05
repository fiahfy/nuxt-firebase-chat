import firebase from 'firebase'

export const state = () => ({
  user: null
})

export const actions = {
  async signIn ({ commit }) {
    const provider = new firebase.auth.GithubAuthProvider()
    await this.$auth.signInWithPopup(provider)
  },
  async signOut () {
    await this.$auth.signOut()
  },
  async sendMessage ({ state }, { message }) {
    await this.$db.collection('messages').add({
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
  }
}

export const getters = {
  isSignedIn (state) {
    return !!state.user
  }
}
