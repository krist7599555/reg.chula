<template>
  <div id="login-page" class="section">
    <div style="height: fit-content;">
      <h1 class="title has-text-white">ออกจากระบบ</h1>
      <span>{{message}}</span>
    </div>
  </div>
</template>


<script lang='js'>
// import axios from "axios";
// import * as _ from "lodash";
// import { Component, Vue } from 'nuxt-property-decorator'
import Vue from 'vue'
export default Vue.extend({
  name: 'logout',
  layout: 'chula',
  data() {
    return {
      message: 'send request...'
    }
  },
  mounted() {
    this.$auth.logout()
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
