<template>
  <div>
    <navigate/>
    <nuxt/>
    <footerbar/>
  </div>
</template>

<script>
import navigate from "../components/layouts/NavigateBar";
import footerbar from "../components/layouts/Footer.vue";
export default {
  components: {
    navigate,
    footerbar
  },
  data() {
    return {
      navshow: false,
      paths: [{ name: "index" }, { name: "about" }, { name: "user" }]
    };
  }
};
</script>
