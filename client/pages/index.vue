<template>
  <div class="hero is-fullheight-with-navbar is-info">
    <div id="home-page" class="hero-body">
      <div class="container">
        <div class="title">HOME</div>
        <div class="buttons">
          <nuxt-link to="/profile" class="button is-warning is-rounded">profile</nuxt-link>
          <nuxt-link to="/course" class="button is-warning is-rounded">course</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  layout: 'chula',
  asyncData({ redirect }) {
    return {}
  },
  methods: {
    clk(num) {
      console.log('click')
    }
  }
}
</script>

<style lang='scss' scoped>
#home-page {
  // min-height: calc(100vh - 328px);
  align-items: center;
  background-image: linear-gradient(#348ce6, #a7d3e4);
  background-image: url(../assets/img/cu-bg.jpg);
  background-color: #363636;
  background-blend-mode: overlay;
}
</style>
