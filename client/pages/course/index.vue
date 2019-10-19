<template lang="pug">
.columns.is-marginless
  .column.is-paddingless.is-2(style='min-width: 240px;')
    CourseSetting(
      :search.sync='search'
      :gened.sync='gened'
      :schedule.sync='schedule'
      @submit='filteringCourses'
    )
  .column.is-paddingless
      CourseTable(:courses='courses')
</template>

<script>
import CourseSetting from '~/components/CourseSetting.vue'
import CourseTable from '~/components/CourseTable.vue'
import * as _ from 'lodash'
export default {
  layout: 'chula',
  components: {
    CourseSetting,
    CourseTable
  },
  data() {
    return {
      _courses: null,
      courses: null,
      search: '',
      gened: ['SO', 'HU', 'SC', 'IN'],
      schedule: [
        'MO-1',
        'MO-2',
        'TU-1',
        'TU-2',
        'WE-1',
        'WE-2',
        'TH-1',
        'TH-2',
        'FR-1',
        'FR-2',
        'SA-1',
        'SA-2'
      ]
    }
  },
  async mounted() {
    this._courses = await this.$axios
      .get('/api/courses?gened')
      .then(res => res.data)
    this.courses = _.cloneDeep(this._courses)
    this.filteringCourses()
  },
  methods: {
    filteringCourses() {
      console.log('filterCourses')
      const str2time = str => Date.parse('2019 ' + str) // eg. "2019 00:00"
      this.courses = _.cloneDeep(this._courses)
        .map(course => {
          const oksec = _.compact(
            _.map(course.schedule, (times, sec) =>
              _.every(times, time => {
                console.log(str2time(time.เวลาเริ่ม), str2time('13:00'))
                if (str2time(time.เวลาเริ่ม) < str2time('13:00')) {
                  return this.schedule.includes(`${time.วันเรียน}-1`)
                } else {
                  return this.schedule.includes(`${time.วันเรียน}-2`)
                }
              })
                ? sec
                : null
            )
          )
          console.log(course)
          return _.assign(course, { schedule: _.pick(course.schedule, oksec) })
        })
        .filter(course => {
          const str = JSON.stringify(course)
          return (
            str.includes(this.search) &&
            _.some(this.gened, k => str.includes(`GENED-${k}`))
          )
        })
      this.$toast.open({
        type: 'is-info',
        message: `found ${this.courses.length} results`
      })
    }
  }
}
</script>


