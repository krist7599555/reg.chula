<template lang="pug">
.content
  template(v-if='course')
    h3
      router-link(:to="'/course/' + course.courseID")
        | {{course.courseABBR}} :  {{course.courseID}}
    p
      | {{course.courseEN}} #[br]
      | {{course.courseTH}}

    h5 ตารางสอบ
    p
      table.is-narrow.is-mobile
        tbody
          tr
            td: strong midterm
            td {{course.examMidterm || "ไม่ระบุ"}}
          tr
            td: strong final
            td {{course.examFinal || "ไม่ระบุ"}}

    h5 ตารางเรียน
    ul
      li(v-for='($row, $sec) in course.schedule' :key='$row.id' style='margin: 20px 5px')
        | sect {{$sec}} ({{$row[0].ลงทะเบียน}}/{{$row[0].ที่นั้งทั้งหมด}})
        span.is-size-7 ** {{$row[0].หมายเหตุ}}
        ul
          li(v-for='it in $row')
            p.
              #[b-tooltip(type='is-info' label='') {{it.วันเรียน}}] {{it.เวลาเรียน}}
              @#[b-tooltip(type='is-info' label='') #[a(:href='"/building/" + it.อาคาร') {{it.อาคาร}}]] room {{it.ห้อง}} by #[a(:href='"/teacher/" + it.ผู้สอน') {{it.ผู้สอน}}]
    h5 หน่วยกิต
    p {{course.credit}}
    h5 หมายเหตุ
    p {{course.condition || "-"}}
    h5 หน่วยงาน
    p {{course.faculty}}
    h5 ช่วงระยะเวลา
    p ระบบศึกษา {{course.year}} เทอม {{course.semester}}

  template(v-if='series && $auth.user')
    no-ssr
      h5 ผลการศึกษา
      p กลุ่มตัวอย่างอาจมีน้อยจนไม่สามารถอธิบายข้อมูลได้ โปรดใช้วิจารณญาณในการตีความ
      VueApexCharts(type="bar" height=350 :options="chartOptions" :series="series")

  template(v-if='course')
    h5 แหล่งข้อมูลอื่น
    ul
      li
        a(:href='`http://www.gened.chula.ac.th/course/${course.courseID}`') gened.chula.ac.th
      li
        a(:href="`http://www.google.com/search?q=gened+${course.courseID}`") google.com
    br
    h3 comments/reviews
    hr
    no-ssr
      Post(v-for='p in posts' :key='p.id' :name='p.anonymous ? "-anonymous-" :  p.owner' :message='p.message')
      Post(v-if='!!$auth.user' :create='true' :courseID='courseID' @created='fetchPosts')
</template>

<script lang="js">
import _ from "lodash";
import axios from "axios";
import RegNumber from "./RegNumber.vue";
import Post from "./Post.vue";

const VueApexCharts = () => import('vue-apexcharts')

export default {
  name: "detail-card",
  components: { RegNumber, Post, VueApexCharts },
  props: ["courseID"],
  data() {
    return {
      course: null,
      grades: null,
      posts: null
    }
  },
  async mounted() {
    console.log(this.courseID)
    this.course = await this.$axios
      .get(`/api/courses/${this.courseID}`)
      .then(res => res.data)
    this.grades = await this.$axios
      .get(`/api/grades/${this.courseID}`)
      .then(res => res.data)
    await this.fetchPosts()
    this.$forceUpdate()
  },
  computed: {
    series() {
      if (!this.grades) return []
      const gradeLabel = "A B+ B C+ C D+ D F S U V W I X".split(" ")
      return gradeLabel.map(lab => {
        return {
          name: lab,
          data: this.grades.map(({detail}) => _.result(_.find(detail, {grade: lab}), "count", 0))
        }
      }).filter(o => _.some(o.data))
    },
    chartOptions() {
      return {
        chart: {
          stacked: true,
          stackType: '100%',
          toolbar: {
            show: true,
            tools: { download: false }
          },
          animations: {enabled: true}
        },
        plotOptions: { bar: { horizontal: true } },
        stroke: { width: 1, colors: ['#fff'] },
        title: { text: "" },
        xaxis: { categories: _.map(this.grades || [], g => `${g.year} เทอม ${g.semester}`) },
        tooltip: {
          enabled: true,
          y: { formatter: (val) => val + " คน" }
        },
        fill: { opacity: 1 },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      }
    }
  },
  methods: {
    async fetchPosts() {
      this.posts =  await this.$axios
        .get(`/api/posts/${this.courseID}`)
        .then(res => res.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.content table td {
  border: none;
  padding: 0.2em 0.75em;
}
.is-clearfix tr {
  margin-bottom: 0.3rem !important;
  td {
    display: flex !important;
    // text-align: left;
  }
}
</style>
