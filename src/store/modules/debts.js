import axios from "axios";
const debts = {
  namespaced: true,
  state: () => ({
    debts: [],
    debt_query: "",
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
    GET_DEBTS(state, debts) {
      state.debts.splice(0, state.debts.length);
      debts.forEach((element) => {
        state.debts.push(element);
      });
    },
    DELETE_DEBT(state, debt) {
      let index = state.debts.findIndex((e) => e.id == debt.id);
      state.debts.splice(index, 1);
    },
    MAKE_DEBT(state, debt) {
      let index = state.debts.findIndex((element) => element.id === debt.id);
      state.debts.splice(index, 1);
      state.debts.unshift(debt);
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.debts = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    get_debts({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.debt_query != undefined &&
          state.debt_query != null &&
          state.debt_query.length > 0
        )
          query = `&query=${state.debt_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_debts" +
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
            commit("GET_DEBTS", response.data.result);
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
    make_debt({ commit, state, rootState }, data) {
      state.pop_loading = true;
      state.table_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/make_debt",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.pop_loading = false;
            state.table_loading = false;
            commit("MAKE_DEBT", response.data.result[0]);
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
    delete_debt({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_debt",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_DEBT", data);
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
export default debts;
