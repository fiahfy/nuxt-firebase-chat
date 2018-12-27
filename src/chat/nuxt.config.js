module.exports = {
  /*
   ** Build configuration
   */
  build: {},

  /*
   ** Headers of the page
   */
  head: {
    title: 'chat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/chat/favicon.ico' }]
  },

  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Mode
   */
  mode: 'spa',

  /*
   ** Modules
   */
  modules: ['@nuxtjs/dotenv', '@nuxtjs/vuetify'],

  /*
   ** Plugins
   */
  plugins: ['~/plugins/firebase'],

  /*
   ** Router configuration
   */
  router: {
    base: '/chat/'
  }
}
