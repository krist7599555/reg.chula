<template lang="pug">
.section
  form(@submit.prevent='$emit("submit")' style='max-width: 470px; margin: 0 auto')
    b-field(expanded)
      b-input(:value='search' @input="$emit('update:search', $event)" type='search' placeholder='search..' rounded)
    br
    .is-flex(style='flex-wrap: wrap; justify-content: space-evenly;')
      .field
        b-field(v-for='kind in "SO HU SC IN".split(" ")' :key='kind')
          b-switch(:value='gened.includes(kind)' @input='genedToggle(kind)') {{genedTexts[kind]}}
        br
      .field
        b-field
          tbody#courseSettingSchedule
            tr(v-for='day in "MO TU WE TH FR".split(" ")' :key='day')
              td: strong(:day='day') {{day}}
              td(v-for='period in 2')
                b-button(:type="scheduleBtn(day, period)" @click='scheduleToggle(day, period)') {{period == 1 ? "เช้า" : "บ่าย"}}
        br
    b-field
      b-button(type='is-info' native-type="submit" rounded) search
</template>
<script>
import * as _ from 'lodash'
export default {
  props: ['search', 'schedule', 'gened'],
  data() {
    return {
      genedTexts: {
        SO: 'so สังคม',
        HU: 'hu มนุษย์',
        SC: 'sc วิทย์',
        IN: 'in สห'
      }
    }
  },
  methods: {
    genedToggle(kind) {
      console.log(kind)
      this.$emit('update:gened', _.xor(this.gened, [kind]))
    },
    scheduleToggle(day, period) {
      this.$emit('update:schedule', _.xor(this.schedule, [`${day}-${period}`]))
    },
    scheduleBtn(day, period) {
      return this.schedule.includes(`${day}-${period}`)
        ? 'is-success'
        : 'is-light'
    }
  }
}
</script>

<style lang="scss" scoped>
.margin-5 {
  margin: 5px;
}
#courseSettingSchedule {
  td {
    text-align: center;
    padding: 1px;
  }
  td .button {
    width: 70px;
  }
  td:first-child {
    padding: 7px;
    strong {
      padding: 4px;
      border-radius: 13px;
      // &[day='MO'] {
      //   background-color: #f0f0a6;
      // }
      // &[day='TU'] {
      //   background-color: #eec8f1;
      // }
      // &[day='WE'] {
      //   background-color: #92f37e;
      // }
      // &[day='TH'] {
      //   background-color: #f2dfa9;
      // }
      // &[day='FR'] {
      //   background-color: #a9e7f2;
      // }
    }
  }
}
</style>
