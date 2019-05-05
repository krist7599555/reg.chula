<template>
  <div class="hero is-fullheight is-info">
    <div class="hero-body">
      <div class="container">
        <div class="title">HOME</div>
        <div class="buttons">
          <button class="button is-warning is-rounded">btn1</button>
          <button class="button is-warning is-rounded">btn2</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  layout: "chula",
  asyncData({ redirect }) {
    redirect("/profile");
  }
};
</script>

<style lang='scss' scoped>
</style>
