module.exports = {
  /*
   ** Build configuration
   */
  build: {},

  /*
   ** Global CSS
   */
  css: ['~/assets/css/app.css'],

  /*
   ** Headers of the page
   */
  head: {
    title: 'Chat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Chat app with firebase'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
  modules: [['@nuxtjs/dotenv', { path: process.cwd() }], '@nuxtjs/vuetify'],

  /*
   ** Plugins
   */
  plugins: ['~/plugins/firebase'],

  /*
   ** Source directory
   */
  srcDir: 'src'
}
