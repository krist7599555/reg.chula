<template lang="pug">
section.section
 .hero
  .hero-body
    .title Course {{courseID}}
</template>

<script>
export default {
  name: "course-id",
  layout: "chula",
  data() {
    return {
      courseID: this.$route.params.id
    };
  },
  created() {}
};
</script>


