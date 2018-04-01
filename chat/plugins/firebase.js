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
    const db = firebase.firestore()
    Vue.prototype.$firebase = firebase
    Vue.prototype.$db = db
  }
}

Vue.use(firebasePlugin)

export default (ctx) => {
  const { app, store } = ctx

  app.$firebase = Vue.prototype.$firebase
  app.$db = Vue.prototype.$db
  ctx.$firebase = Vue.prototype.$firebase
  ctx.$db = Vue.prototype.$db
  if (store) {
    store.$firebase = Vue.prototype.$firebase
    store.$db = Vue.prototype.$db
  }
}
