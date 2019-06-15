<template>
  <nav class="navbar is-transparent is-dark">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <img src="../assets/img/cu-white-240x120.png">
        <div style="margin-top: 1rem; margin-left: .3rem;">
          <span class="sub is-size-7">beta {{isLogin}}</span>
        </div>
      </router-link>
      <div class="navbar-burger burger" @click="navshow = !navshow" :class="{'is-active': navshow}">
        <span v-for="_ in 3" :key="_"></span>
      </div>
    </div>
    <div class="navbar-menu chula-ch" :class="{'is-active': navshow}">
      <div class="navbar-start">
        <nuxt-link
          class="navbar-item"
          v-for="p in paths"
          :to="p"
          :key="p.id"
          v-show="p.show != false"
        >{{p.name}}</nuxt-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <nuxt-link to="/login" v-if="!isLogin">
                <button class="button is-dark">LOGIN</button>
              </nuxt-link>
              <nuxt-link to="/logout" v-else>
                <button class="button is-dark">LOGOUT</button>
              </nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navigate-bar',
  data() {
    return {
      navshow: false,
      paths: [{ name: 'index' }, { name: 'profile', show: !!this.isLogin }]
    }
  },
  computed: {
    isLogin() {
      return !!this.$auth.user
    }
  }
}
</script>
