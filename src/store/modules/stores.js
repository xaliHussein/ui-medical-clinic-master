import axios from "axios";
import moment from "moment";
const stores = {
  namespaced: true,
  state: () => ({
    stores: [],
    expired_stores: [],
    representatives: [],
    store_query: "",
    store_expired_query: "",
    representative_query: "",
    pageCount: 1,
    pageCount2: 1,
    pageCount3: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_expired: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_representative: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    my_date: moment().format("YYYY-MM-DD"),
    expiry_date: null,
    representative_state: "done",
    loading_add_medicine: false,
    table_loading: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_MEDICINE(state, store) {
      state.stores.unshift(store);
    },
    GET_STORES(state, store) {
      state.expiry_date = moment(state.my_date, "YYYY-MM-DD")
        .add(30, "days")
        .format("YYYY-MM-DD");
      state.expired_stores.splice(0, state.expired_stores.length);
      state.stores.splice(0, state.stores.length);

      store.forEach((element) => {
        // ادوية شارفت على انتهاء الصلاحية
        if (state.expiry_date > element.expaired) {
          state.expired_stores.push(element);
          // ادوية غير منتهية الصلاحية
        } else {
          state.stores.push(element);
        }
      });
    },
    GET_STORES_EXPIRED(state, store) {
      state.expired_stores.splice(0, state.expired_stores.length);
      store.forEach((element) => {
        state.expired_stores.push(element);
      });
    },
    DELETE_MEDICINE(state, store) {
      let index = state.stores.findIndex((e) => e.id == store.id);
      state.stores.splice(index, 1);
    },
    EDIT_STORE(state, store) {
      let index = state.stores.findIndex((element) => element.id === store.id);
      state.stores.splice(index, 1);
      state.stores.unshift(store);
    },
    GET_REPRESENTATIVES(state, representative) {
      state.representatives.splice(0, state.representatives.length);
      representative.forEach((element) => {
        state.representatives.push(element);
      });
      state.representative_state = "done";
    },
    REPRESENTATIVES_DREPDWON_SUCCESS(state, representative) {
      if (representative.length == 0) {
        state.representative_state = "finished";
        if (state.params_representative.page > 1)
          state.params_representative.page =
            state.params_representative.page - 1;
        return;
      }
      state.params_representative.page = state.params_representative.page + 1;
      representative.forEach((element) => {
        state.representatives.push(element);
      });
      state.representative_state = "done";
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.stores = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async reset_table_expired({ state }) {
      state.pageCount3 = 1;
      state.expired_stores = [];
      state.table_loading = false;
      state.params_expired = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    add_medicine({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_medicine = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_to_store",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_medicine = false;
            commit("ADD_MEDICINE", response.data.result[0]);
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
            state.loading_add_medicine = false;
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
      let data = state.params_representative;
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
            state.pageCount2 = response.data.count;
            if (data.dropdown == false) {
              commit("GET_REPRESENTATIVES", response.data.result);
            } else {
              commit("REPRESENTATIVES_DREPDWON_SUCCESS", response.data.result);
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

    get_stores({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.store_query != undefined &&
          state.store_query != null &&
          state.store_query.length > 0
        )
          query = `&query=${state.store_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_stores" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount = response.data.count;
            commit("GET_STORES", response.data.result);
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
    get_stores_expired({ commit, state, rootState }) {
      let data = state.params_expired;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.store_expired_query != undefined &&
          state.store_expired_query != null &&
          state.store_expired_query.length > 0
        )
          query = `&query=${state.store_expired_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_stores_expaired" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount3 = response.data.count;
            commit("GET_STORES_EXPIRED", response.data.result);
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
    edit_medicine({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/edit_store",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_STORE", response.data.result[0]);
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
    delete_medicine({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_store",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_MEDICINE", data);
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
  },
};
export default stores;
