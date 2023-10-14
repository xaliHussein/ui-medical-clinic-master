import axios from "axios";
const representatives = {
  namespaced: true,
  state: () => ({
    representatives: [],
    log_representative: [],
    representative_query: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    pageCount2: 1,
    params_payments: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    representative_id: null,
    loading_payments: false,
    loading_add_representative: false,
    table_loading: false,
    table_payments_loading: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_REPRESENTATIVE(state, representative) {
      state.representatives.unshift(representative);
    },
    GET_REPRESENTATIVES(state, representative) {
      state.representatives.splice(0, state.representatives.length);
      representative.forEach((element) => {
        state.representatives.push(element);
      });
    },
    DELETE_REPRESENTATIVE(state, representative) {
      let index = state.representatives.findIndex(
        (e) => e.id == representative.id
      );
      state.representatives.splice(index, 1);
    },
    EDIT_REPRESENTATIVE(state, representative) {
      let index = state.representatives.findIndex(
        (element) => element.id === representative.id
      );
      state.representatives.splice(index, 1);
      state.representatives.unshift(representative);
    },
    GET_LOGS_REPRESENTATIVE(state, log) {
      state.log_representative.splice(0, state.log_representative.length);
      log.forEach((element) => {
        state.log_representative.push(element);
      });
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.representatives = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    add_representative({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_representative = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_representative",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_representative = false;
            commit("ADD_REPRESENTATIVE", response.data.result[0]);
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
            state.loading_add_representative = false;
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

    get_representatives({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.representative_query != undefined &&
          state.representative_query != null &&
          state.representative_query.length > 0
        )
          query = `&query=${state.representative_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_representatives" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount = response.data.count;
            commit("GET_REPRESENTATIVES", response.data.result);
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
    edit_representative({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/edit_representative",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_REPRESENTATIVE", response.data.result[0]);
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
    delete_representative({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_representative",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_REPRESENTATIVE", data);
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = "تمت العملية بنجاح";
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
    get_logs({ commit, state, rootState }) {
      let data = state.params_payments;
      state.table_payments_loading = true;
      state.loading_payments = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        var filter = "";
        var representative = {
          name: "target_id",
          value: state.representative_id,
        };
        filter = "&filter=" + JSON.stringify(representative);
        axios({
          url:
            `${rootState.server}` +
            "/api/get_logs" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            filter,
          method: "get",
        })
          .then((response) => {
            state.table_payments_loading = false;
            state.loading_payments = false;
            state.pageCount2 = response.data.count;
            commit("GET_LOGS_REPRESENTATIVE", response.data.result);
            resolve(response);
          })
          .catch(() => {
            state.table_payments_loading = false;
            state.loading_payments = false;
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
  },
};
export default representatives;
