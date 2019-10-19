<template lang="pug">
section.section
 div(style='max-width: 600px; margin: 0 auto; margin-top: 30px')
    CourseCard(:courseID='$route.params.id')
</template>

<script>
import CourseCard from '~/components/CourseCard.vue'
export default {
  name: 'course-id',
  layout: 'chula',
  components: { CourseCard }
}
</script>


