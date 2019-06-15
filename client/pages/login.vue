<template>
  <div id="login-page" class="section">
    <div class="box" style="height: fit-content;">
      <h1 class="title">
        เข้าสู่ระบบ
        <a
          class="has-text-info"
          href="https://account.it.chula.ac.th/wiki/doku.php"
          target="_blank"
        >
          <b-tooltip label="using CU SSO Authentication" type="is-link" position="is-top">
            <b-icon icon="info-circle" size="is-small"></b-icon>
          </b-tooltip>
        </a>
      </h1>
      <no-ssr>
        <b-field>
          <b-input v-model="username" type="text" placeholder="เลขนิสิต 10 หลัก"></b-input>
        </b-field>
        <b-field>
          <b-input
            v-model="password"
            type="password"
            placeholder="เหมือน reg.chula"
            password-reveal
          ></b-input>
        </b-field>
        <b-field>
          <b-button type="is-primary" @click="submit" :loading="loading">submit</b-button>
        </b-field>
      </no-ssr>
    </div>
  </div>
</template>


<script lang='js'>
import axios from 'axios'
import * as _ from 'lodash'
import Vue from 'vue'
export default Vue.extend({
  name: 'login',
  layout: 'chula',
  data() {
    return {
      loading: false,
      username: '',
      password: ''
    }
  },
  methods: {
    async submit() {
      this.loading = true
      this.$auth.loginWith('local', {
        data: {
          username: this.username,
          password: this.password
        }
      }).then((res) => {
        console.log("FINISH")
      }).finally(() => (this.loading = false))
    }
  }
})
</script>

<style lang="scss" scoped>
.section {
  display: flex;
  justify-content: center;
}
.box {
  max-width: $tablet;
}
#login-page {
  min-height: calc(100vh - 328px);
  align-items: center;
  background-image: linear-gradient(#348ce6, #a7d3e4);
  background-image: url(../assets/img/cu-bg.jpg);
  background-color: #363636;
  background-blend-mode: overlay;
}
</style>
