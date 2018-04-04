import Vue from 'vue'
import Firebase from 'firebase'
import 'firebase/firestore'

const firebasePlugin = {
  install () {
    const firebase = Firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET
    })
    Vue.prototype.$db = firebase.firestore()
    Vue.prototype.$auth = firebase.auth()
  }
}

Vue.use(firebasePlugin)

export default (ctx) => {
  const { app, store } = ctx

  app.$db = Vue.prototype.$db
  app.$auth = Vue.prototype.$auth
  ctx.$db = Vue.prototype.$db
  ctx.$auth = Vue.prototype.$auth
  if (store) {
    store.$db = Vue.prototype.$db
    store.$auth = Vue.prototype.$auth
  }
}
