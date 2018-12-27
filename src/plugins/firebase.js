import Vue from 'vue'
import Firebase from 'firebase/app'
import 'firebase/firestore'

const firebasePlugin = {
  install() {
    const firebase = Firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET
    })
    const firestore = firebase.firestore()
    firestore.settings({ timestampsInSnapshots: true })
    Vue.prototype.$db = firestore
    Vue.prototype.$auth = firebase.auth()
  }
}

Vue.use(firebasePlugin)

export default async (ctx) => {
  const { app, store } = ctx

  app.$db = Vue.prototype.$db
  app.$auth = Vue.prototype.$auth
  ctx.$db = Vue.prototype.$db
  ctx.$auth = Vue.prototype.$auth
  if (store) {
    store.$db = Vue.prototype.$db
    store.$auth = Vue.prototype.$auth
  }

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
