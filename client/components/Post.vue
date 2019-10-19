<template lang="pug">
article.media: no-ssr
  figure.media-left
    p.image.is-32x32
      img(src='https://bulma.io/images/placeholders/128x128.png')
  .media-content
    .content
      p
        strong(v-if='create && $auth.user') {{$auth.user.nameEN}} {{$auth.user.surnameEN}}
        strong(v-else) {{name}}
        br
        div(v-if='!create') {{message}}
        div(v-else)
          b-field
            b-input(type='textarea' v-model='newmessage')
          b-field
            b-switch(size='is-small' v-model='anonymous') anonymous
          b-field
            b-button(type='is-info' @click='submit') submit
    //- nav.level.is-mobile
    //-   .level-left
    //-     a.level-item
    //-       span.icon.is-small
    //-         i.fas.fa-reply
    //-     a.level-item
    //-       span.icon.is-small
    //-         i.fas.fa-retweet
    //-     a.level-item
    //-       span.icon.is-small
    //-         i.fas.fa-heart
    slot
  //- .media-right
    //- button.delete
</template>

<script lang="js">
export default {
  props: ["create", "courseID", "name", "image", "message"],
  data() {
return {
  newmessage: "",
  anonymous: false
}
  },
  methods: {
    submit() {
      this.$axios.post("/api/posts/" + this.courseID, {
        ouid: this.$auth.user.ouid,
        parent: this.courseID,
        message: this.newmessage,
        anonymous: this.anonymous
      }).then(res => {
        console.log(res.data)
        this.$emit("created", res.data);
        this.$toast.open({
          message: "post have been created.",
          type: "is-success"
        })
      }).catch(err => {
          console.error(err)
          this.$toast.open({
            message: err.message,
            type: "is-danger"
          })

      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
