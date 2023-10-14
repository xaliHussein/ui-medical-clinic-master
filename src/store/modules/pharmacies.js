import axios from "axios";
import moment from "moment";
const pharmacies = {
  namespaced: true,
  state: () => ({
    medicines: [],
    expired_medication: [],
    medicine_query: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    my_date: moment().format("YYYY-MM-DD"),
    expiry_date: null,
    loading_add_medicine: false,
    table_loading: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_MEDICINE(state, medicine) {
      state.medicines.unshift(medicine);
    },
    GET_MEDICINES(state, medicine) {
      state.expiry_date = moment(state.my_date, "YYYY-MM-DD")
        .add(30, "days")
        .format("YYYY-MM-DD");
      state.medicines.splice(0, state.medicines.length);
      state.expired_medication.splice(0, state.expired_medication.length);
      medicine.forEach((element) => {
        // ادوية شارفت على انتهاء الصلاحية
        if (state.expiry_date > element.expaired) {
          state.expired_medication.push(element);
          // ادوية غير منتهية الصلاحية
        } else {
          state.medicines.push(element);
        }
      });
    },
    DELETE_MEDICINE(state, medicine) {
      let index = state.medicines.findIndex((e) => e.id == medicine.id);
      state.medicines.splice(index, 1);
    },
    EDIT_MEDICINE(state, medicine) {
      let index = state.medicines.findIndex((e) => e.id === medicine.id);
      state.medicines.splice(index, 1);
      state.medicines.unshift(medicine);
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.medicines = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async reset_table_exp({ state }) {
      state.pageCount = 1;
      state.expired_medication = [];
      state.table_loading = false;
      state.params = {
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
          url: `${rootState.server}` + "/api/add_to_pharmacy",
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
          .catch((err) => {
            state.table_loading = false;
            state.loading_add_medicine = false;
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
    get_medicines({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.medicine_query != undefined &&
          state.medicine_query != null &&
          state.medicine_query.length > 0
        )
          query = `&query=${state.medicine_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_pharmacy" +
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
            commit("GET_MEDICINES", response.data.result);
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
          url: `${rootState.server}` + "/api/edit_pharmacy",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_MEDICINE", response.data.result[0]);
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
          url: `${rootState.server}` + "/api/delete_pharmacy",
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
export default pharmacies;
