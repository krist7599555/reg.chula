const pkg = require('./package.json')

export default {
  mode: 'universal',
  // server: {
  //   port: 8080,
  //   host: '0.0.0.0'
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['plugins/vue-fortawesome.js'],
  buefy: {
    css: false,
    materialDesignIcons: false,
    defaultIconPack: 'fas'
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    'vue-scrollto/nuxt'
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/login', method: 'post' },
          logout: { url: '/api/logout', method: 'get' },
          user: { url: '/api/profile', method: 'get', propertyName: false }
        },
        tokenRequired: false,
        tokenType: false
        // tokenRequired: true,
        // tokenType: 'bearer'
      }
    }
  },
  styleResources: {
    scss: ['~/assets/scss/main.scss']
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy:
    process.env.NODE_ENV == 'production'
      ? {
          '/api': 'https://gened.ml'
        }
      : {
          '/api': 'http://0.0.0.0:3000'
        },

  /*
   ** Build configuration
   */
  build: {
    // cache: true,
    // hardSource: true,
    // parallel: true,
    // loaders: {
    //   ts: {
    //     transpileOnly: true,
    //     appendTsSuffixTo: [/\.vue$/]
    //   }
    // },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
