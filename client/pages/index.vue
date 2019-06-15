<template>
  <div class="hero is-fullheight is-info">
    <div class="hero-body">
      <div class="container">
        <div class="title">HOME</div>
        <div class="buttons">
          <button class="button is-warning is-rounded" @click="clk(1)">btn1</button>
          <button class="button is-warning is-rounded" @click="clk(2)">btn2</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='js'>
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
</style>
