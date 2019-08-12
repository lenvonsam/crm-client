const bodyParser = require('body-parser')
const session = require('express-session')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '客户关系管理系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content:'IE=Edge'},
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_717889_isvq6v9i2j.css' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  plugins: [{
    src: '~/plugins/element-ui',
    ssr: true
  }, {
    src: '~/plugins/filter'
  }, {
    src: '~/plugins/mixins'
  }],
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['axios', 'element-ui', 'sha1', 'lodash'],
    css: [{
      src: 'bulma',
      lang: 'stylus'
    }],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  // server middleware
  serverMiddleware: [
    bodyParser.json(),
    // session
    session({
      secret: 'zhd-crm-client',
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 10800000}
    }),
    '~/server/proxy'
  ]
}
