<template lang='pug'>
.columns.is-marginless
  //- .column.is-paddingless.is-2.is-hidden-mobile
    //- aside
    //- div SIDE BAR
  .column.is-paddingless
    .section.bg(align='center')
      div(align='center' style='max-width: 600px')
        .columns
          .column.is-5
            div(style='max-width: 200px')
              img.profile__image(src='https://graph.facebook.com/100001545890948/picture?width=300&height=300')
          .column
            .content.namehead__wrapper(v-if='profile' align='left')
              h1 {{profile.nameEN}} {{profile.surnameEN}}
              h4 {{profile.facultyEN}} # {{profile.year}}
            div(v-else) LOGIN INFORMATION
        //- .content(align='left')
          b-field
            b-switch(:value="lineUserId" type="is-success" @input='linelogin') Line
        br
        .tabs.is-centered
          ul
            li
              nuxt-link(to='/profile')
                b-icon(icon='user' pack='far')
                span profile
            //- li
            //-   a
            //-     //- b-icon(icon='lock' pack='far')
            //-     b-icon(icon='eye-slash' pack='far')
            //-     //- span.icon
            //-       <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-lock fa-w-14 fa-2x"><path fill="currentColor" d="M400 192h-32v-46.6C368 65.8 304 .2 224.4 0 144.8-.2 80 64.5 80 144v48H48c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48zm-272-48c0-52.9 43.1-96 96-96s96 43.1 96 96v48H128v-48zm272 320H48V240h352v224z" class=""></path></svg>
            //-     span private
            li
              nuxt-link(to='/profile/event')
                b-icon(icon='calendar-alt' pack='far')
                span event
            li
              nuxt-link(to='/profile/course')
                //- b-icon(icon='graduation-cap' pack='fas')
                //- b-icon(icon='chalkboard' pack='fas')
                b-icon(icon='chart-bar' pack='far')
                span course
        nuxt-child
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'profile',
  layout: 'chula',
  data() {
    return {}
  },
  computed: {
    profile() {
      // this.$data
      return this.$store.getters.user
    }
  },
  async fetch({ store, $axios, redirect }) {
    await $axios
      .get('/api/profile', { withCredentials: true })
      .then(res => {
        store.commit('setUser', res.data)
      })
      .catch(err => {
        console.log('PROFILE', err)
        // if (err.response.status == 401) {
        //   redirect("/login");
        // } else {
        //   console.error(err.response);
        //   console.error(err.message);
        //   console.error(err.response.status);
        // }
      })
  },
  async created() {},
  mounted() {
    console.log(';mounted')
  },
  methods: {
    linelogin() {
      // window.location.href = "/api/auth/line/login";
    }
  }
})
</script>

<style lang="scss" scoped>
.bg {
  min-height: calc(100vh - 56px);
  background-color: #fafafa;
}
.profile__image {
  border-radius: 1000px;
  box-sizing: border-box;
  border: solid 2px #ccc;
  padding: 5px;
  max-height: 150px;
}
.namehead__wrapper {
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  @media screen and (min-width: $tablet) {
    align-items: normal;
  }
}
</style>
