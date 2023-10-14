import axios from "axios";
const clinics = {
  namespaced: true,
  state: () => ({
    medical_clinic: [],
    clinic_query: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },

    loading_add_clinic: false,
    table_loading: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_MEDICAL_CLINIC(state, clinic) {
      state.medical_clinic.unshift(clinic);
    },
    GET_MEDICAL_CLINICS(state, clinic) {
      state.medical_clinic.splice(0, state.medical_clinic.length);
      clinic.forEach((element) => {
        state.medical_clinic.push(element);
      });
    },
    DELETE_CLINIC(state, clinic) {
      let index = state.medical_clinic.findIndex((e) => e.id == clinic.id);
      state.medical_clinic.splice(index, 1);
    },
    EDIT_MEDICAL_CLINIC(state, clinic) {
      let index = state.medical_clinic.findIndex(
        (element) => element.id === clinic.id
      );
      state.medical_clinic.splice(index, 1);
      state.medical_clinic.unshift(clinic);
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.medical_clinic = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    add_medical_clinic({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_clinic = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_clinic",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_clinic = false;
            commit("ADD_MEDICAL_CLINIC", response.data.result[0]);
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
            state.table_loading = false;
            state.loading_add_clinic = false;
            let snack_message = {};
            snack_message["color"] = "#ef4444";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = err.response.data.message;
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },
    get_clinics({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
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
            state.table_loading = false;
            commit("GET_MEDICAL_CLINICS", response.data.result);
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
    edit_medical_clinic({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/edit_clinic",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_MEDICAL_CLINIC", response.data.result[0]);
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
    delete_clinic({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_clinic",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_CLINIC", data);
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
    get_image_clinic({ commit, state, rootState }, data) {
      return new Promise((resolve) => {
        state.loadingButton = true;
        axios({
          url: `${rootState.server}` + "/api/get_image_clinic",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        }).then((response) => {
          localStorage.setItem("image_clinic", response.data.result[0]);
          resolve(response);
        });
      });
    },
  },
};
export default clinics;
