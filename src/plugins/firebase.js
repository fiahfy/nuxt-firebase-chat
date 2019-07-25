import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebasePlugin = {
  install() {
    const app = firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET
    })
    Vue.prototype.$auth = app.auth()
    const firestore = app.firestore()
    Vue.prototype.$db = firestore
  }
}

Vue.use(firebasePlugin)

export default async (ctx) => {
  const { app, store } = ctx

  ctx.$auth = app.$auth = store.$auth = Vue.prototype.$auth
  ctx.$db = app.$db = store.$db = Vue.prototype.$db

  await new Promise((resolve) => {
    app.$auth.onAuthStateChanged(function(currentUser) {
      let user = null
      if (currentUser) {
        user = {
          uid: currentUser.uid,
          name: currentUser.displayName,
          photoUrl: currentUser.photoURL
        }
      }
      store.commit('setUser', { user })
      resolve()
    })
  })
}
