import axios from "axios";
const users = {
  namespaced: true,
  state: () => ({
    users: [],
    medical_clinic: [],
    clinic_query: "",
    user_query: "",
    pageCount: 1,
    pageCount2: 1,
    params: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_user: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    clinic_state: "done",
    loading_add_user: false,
    table_loading: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_USERS(state, user) {
      state.users.unshift(user);
    },
    GET_USERS(state, users) {
      state.users.splice(0, state.users.length);
      users.forEach((element) => {
        state.users.push(element);
      });
    },
    DELETE_USER(state, user) {
      let index = state.users.findIndex((e) => e.id == user.id);
      state.users.splice(index, 1);
    },
    EDIT_USER(state, user) {
      let index = state.users.findIndex((element) => element.id === user.id);
      state.users.splice(index, 1);
      state.users.unshift(user);
    },

    GET_MEDICAL_CLINICS(state, clinic) {
      state.medical_clinic.splice(0, state.medical_clinic.length);
      clinic.forEach((element) => {
        state.medical_clinic.push(element);
      });
      state.clinic_state = "done";
    },

    CLINICS_DREPDWON_SUCCESS(state, clinic) {
      if (clinic.length == 0) {
        state.clinic_state = "finished";
        if (state.params.page > 1) state.params.page = state.params.page - 1;
        return;
      }
      state.params.page = state.params.page + 1;
      clinic.forEach((element) => {
        state.medical_clinic.push(element);
      });
      state.clinic_state = "done";
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.users = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    add_user({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_user = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_user",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_user = false;
            commit("ADD_USERS", response.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(response);
          })
          .catch((error) => {
            state.table_loading = false;
            state.loading_add_user = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = error.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    get_clinics({ commit, state, rootState }) {
      let data = state.params;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.clinic_query != undefined &&
          state.clinic_query != null &&
          state.clinic_query.length > 0
        )
          query = `&query=${state.clinic_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_clinics" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount = response.data.count;
            if (data.dropdown == false) {
              commit("GET_MEDICAL_CLINICS", response.data.result);
            } else {
              commit("CLINICS_DREPDWON_SUCCESS", response.data.result);
            }
            resolve(response);
          })
          .catch(() => {
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "حدث مشكلة اثناء الاتصال بالخدام";
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    get_users({ commit, state, rootState }) {
      let data = state.params_user;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.user_query != undefined &&
          state.user_query != null &&
          state.user_query.length > 0
        )
          query = `&query=${state.user_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_users" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount2 = response.data.count;
            commit("GET_USERS", response.data.result);
            state.table_loading = false;
            resolve(response);
          })
          .catch(() => {
            state.table_loading = false;
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "حدث مشكلة اثناء الاتصال بالخدام";
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    edit_user({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/edit_user",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_USER", response.data.result[0]);
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(response);
          })
          .catch((err) => {
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            this.commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              this.commit("TIME_OUT", snack_message);
            }, 4000);
          });
      });
    },
    delete_user({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_user",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_USER", data);
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
            resolve(response);
          })
          .catch((error) => {
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = error.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
  },
};
export default users;
