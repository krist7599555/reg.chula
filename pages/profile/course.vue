<template lang='pug'>
div
  //- .notification.is-danger PRIVATE Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  br
  .is-full-width(align='left')
      b-button(type='is-primary' @click='cr54')
        b-icon(icon='redo')
  br
  br

  div
    div(v-for='{courseID, courseABBR, credit, grade, semester, year} of grades || []')
      nuxt-link.event-card.has-text-dark(:to='`/course/${courseID}`')
        //- .event-img
          //- img(:src='img')
        .event-img.center-content(style='padding-left: 4rem')
          h1(style='font-size: 5rem; min-width: 100px' align='left' :style='gradeStyle(grade)')
            strong(style='filter: drop-shadow(1px 2px 1px #36363644)') {{grade}}
        .event-content
          .event-content__inner
            .event-label {{courseABBR}}
            .event-date {{courseID}}
            .event-status.has-text-success {{semesterStr(semester)}} {{year}}
</template>

<script>
import axios from "axios";
import * as _ from "lodash";
export default {
  name: "profile-course",
  async asyncData({ $axios }) {
    const grades = await $axios
      .get("/api/user/6031301721/grade")
      .then(res =>
        _.orderBy(
          res.data,
          [
            g => g["year"],
            g => g["semester"],
            g => g["grade"] && g["grade"][0],
            g => g["grade"].length
          ],
          ["desc", "desc", "asc", "desc"]
        )
      )
      .catch(err => {
        console.log(err);
        return [];
      });
    return {
      grades
    };
  },
  data() {
    return {
      grades: []
    };
  },
  async created() {
    // this.grades = await axios
    //   .get("/api/user/6031301721/grade")
    //   .then(res => {
    //     console.log(res.data);
    //     return res.data;
    //   })
    //   .catch(err => []);
  },
  methods: {
    cr54() {
      this.$toast.open({
        type: "is-info",
        message: "load new content"
      });
      axios
        .get(`/api/user/${6031301721}/cr54`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          this.$toast.open({
            type: "is-danger",
            message: _.get(err, "response.data", err.message)
          });
          console.error("Error occur", err.message);
        });
    },
    semesterStr(num) {
      return {
        1: "เทอมต้น",
        2: "เทอมปลาย",
        3: "ซัมเมอร์"
      }[num];
    },
    gradeStyle(grade) {
      const choice = {
        A: "#ff8a00",
        "B+": "#f44336",
        B: "#da1b60"
        // "C+": "#03a9f4",
        // C: "#9c27b0",
        // "D+": "#8bc34a",
        // D: "#4caf50"

        // A: "#75b95e",
        // B: "#75b95e",
        // "B+": "#75b95e"
        // A: "#a23361",
        // B: "#a23361",
        // "B+": "#a23361"
        // B: "#f4ab33"
        // B: "#ec7175"
        // "B+": "#c068a8",
        // C: "#5c63a2",
        // "C+": "#1c4e6a",
        // D: "#363636",
        // "D+": "#363636",
        // F: "#363636"
      };
      return {
        color: choice[grade] || "#363636"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
$event-card-height: 120px;
.event-card {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 4px 8px #aaaa;
  transition: all 200ms;
  height: $event-card-height;
  margin-bottom: 15px;
  .event-img {
    flex-grow: 1;
    width: $event-card-height;
    height: $event-card-height;
    img {
      object-fit: cover;
      width: $event-card-height;
      height: $event-card-height;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .event-content {
    flex-grow: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    text-align: left;
    .event-content__inner {
      min-width: 100%;
      padding-left: 50px;
    }
  }
  .event-label {
    font-weight: bold;
  }
  .event-date {
    font-size: 0.8rem;
  }
  .event-status {
    font-size: 0.8rem;
  }
}
.event-card:hover {
  transform: scale(1.02) translateY(-3px);
  box-shadow: 0px 5px 10px #888a;
}

.center-content {
  justify-content: center;
  align-items: center;
  display: flex;
}
.clip-text-bg {
  background-color: blueviolet;
  // background: url(https://i.stack.imgur.com/vLdCL.jpg) -100px -40px no-repeat;
  // -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
