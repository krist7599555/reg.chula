// // import Vuex from "vuex";
import axios from "axios";
// import { Toast } from "buefy/dist/components/toast";

export const state = () => ({
  user: null,
  grades: null
});
export const mutations = {
  setUser(state, user) {
    console.log("set user", user);
    state.user = user;
  },
  setGrade(state, grade) {
    state.grade = grade;
  }
};

export const getters = {
  user: state => state.user
};

export const actions = {};

// // // // export default () =>
// // // //   new Vuex.Store({
// // // //     state: state(),
// // // //     mutation,
// // // //     getters,
// // // //     actions
// // // //   });
