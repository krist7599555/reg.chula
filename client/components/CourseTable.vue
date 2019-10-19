<template lang="pug">
  .monospace#topOfTable.is-flex.is-centered(style='padding-top: 60px; padding-bottom: 40px')
        //- :loading="!courses"
        b-table(
          ref='table'
          :data="courses || []"
          detailed
          paginated
          per-page="10"
          detail-key="courseID"
          icon-pack='fas'
          :mobile-cards='false'
          :opened-detailed="defaultOpenedDetails"
          :show-detail-icon='true'
          :striped='true'
          @click='toggleDetail'
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          @page-change='pageChange'
        )

          template(slot-scope='props')
            b-table-column(field='abbr', label='ชื่อ' width='200') {{props.row.courseABBR}}
            b-table-column(field='cid', label='รหัส' width='100')
              nuxt-link.has-text-link(:to='"/course/" + props.row.courseID')
              | {{ props.row.courseID }}
            b-table-column(field='time', label='ตาราง' width='200')
              div(v-if='!!props.row.schedule')
                table.table.inner-table.is-mobile.is-narrow.is-hoverable(:mobile-cards='false')
                  tbody.has-text-right
                    template(v-for='(room, idx2) in props.row.schedule' style='font-family: monospace')
                      tr.is-size-7(v-for='info in room' v-show='info.วันเรียน != "IA" && info.หมายเหตุ.includes("GENED")')
                        td.has-text-right(style='min-width: 36px; width: 36px') {{room[0].ตอนเรียน}}
                        //- td.has-text-right.is-inversed(style='min-width: 75px; width: 75px') {{info}}
                        td.has-text-right.is-hidden-mobile(style='min-width: 75px; width: 75px') {{info.จำนวนนิสิต}}
                        td.has-text-right(style='min-width: 38px; width: 38px') {{info.วันเรียน}}
                        td.has-text-right(style='min-width: 60px; width: 60px')
                          span {{info.เวลาเริ่ม}}
                          span -
                          span {{info.เวลาจบ}}
                        td.has-text-right(style='min-width: 75px; width: 75px; font-size: 0.6rem') **{{info.หมายเหตุ}}

          template(slot='detail', slot-scope='props')
            .container(style='max-width: 600px; justify-content: center; display: flex; padding-bottom: 50px; padding-top: 30px;')
              CourseCard(:courseID='props.row.courseID')
          template(slot="empty")
            section.section
              .content.has-text-grey.has-text-centered
                p
                  b-icon(icon='frown' size='is-large')
                p Nothing here.
</template>

<script>
import CourseCard from './CourseCard.vue'

export default {
  props: ['courses'],
  components: { CourseCard },
  data() {
    return {
      defaultOpenedDetails: []
    }
  },
  methods: {
    toggleDetail(row) {
      console.log(row)
      this.$refs.table.toggleDetails(row)
      this.$toast.open({
        type: 'is-info',
        message: row.courseID + ' ' + row.courseABBR
      })
    },
    pageChange(page) {
      this.$scrollTo('#topOfTable', 500, {
        offset: -10
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.is-centered {
  justify-content: center;
}
#topOfTable {
  // background-image: url(https://www.pexels.com/photo/926985/download/?search_query=&tracking_id=unxo4k6d8om);
  // background-image: url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=max-bender-572807-unsplash.jpg);
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(~assets/img/background-1.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  min-height: 650px;
}
</style>

<style lang="scss">
#topOfTable .pagination a[role='button']:not(.is-current) {
  background-color: white;
  overflow: hidden;
}

@include mobile {
  #topOfTable .b-table {
    transform: scale(0.85);
    font-size: 0.75rem;
    // margin-left: -20px;
  }
}
</style>

