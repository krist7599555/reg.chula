<template>
  <div>
    <navigate/>
    <nuxt/>
    <footerbar/>
  </div>
</template>

<script>
import navigate from '../components/TheNavigateBar.vue'
import footerbar from '../components/TheFooter.vue'
export default {
  components: {
    navigate,
    footerbar
  },
  created() {
    // this.$store.dispatch('fetchProfile')
  },
  data() {
    return {
      navshow: false,
      paths: [{ name: 'index' }, { name: 'about' }, { name: 'user' }]
    }
  }
}
</script>
