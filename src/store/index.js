import firebase from 'firebase'

export const state = () => ({
  user: null
})

export const actions = {
  async signUpWithEmailAndPassword({ commit }, { email, password, username }) {
    const user = await this.$auth.createUserWithEmailAndPassword(
      email,
      password
    )
    await user.updateProfile({ displayName: username })
    commit('setUsername', { username })
  },
  async signInWithEmailAndPassword(_, { email, password }) {
    await this.$auth.signInWithEmailAndPassword(email, password)
  },
  async signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider()
    await this.$auth.signInWithPopup(provider)
  },
  async signOut() {
    await this.$auth.signOut()
  },
  async sendPasswordResetEmail(_, { email }) {
    await this.$auth.sendPasswordResetEmail(email)
  }
}

export const mutations = {
  setUser(state, { user }) {
    state.user = user
  },
  setUsername(state, { username }) {
    if (!state.user) {
      return
    }
    state.user = {
      ...state.user,
      name: username
    }
  }
}

export const getters = {
  isSignedIn(state) {
    return !!state.user
  }
}
