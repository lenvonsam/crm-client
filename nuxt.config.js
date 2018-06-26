module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '客户关系管理系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_717889_lur42t9l8l9.css' }
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
  }],
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['axios', 'element-ui', 'sha1'],
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
  }
}
