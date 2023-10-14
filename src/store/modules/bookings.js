import axios from "axios";
import moment from "moment";
const bookings = {
  namespaced: true,
  state: () => ({
    bookings: [],
    users: [],
    payments_user: [],
    booking_query: "",
    pageCount3: 1,
    pageCount2: 1,
    pageCount: 1,
    filter: { name: "user_type", value: 2 },
    payment_method: null,
    doctor_id: null,
    booking_id: null,
    loading_debt: false,
    date_from: null,
    date_to: null,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_users: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_payments: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    user_state: "done",

    table_paments_loading: false,
    loading_add_booking: false,
    table_loading: false,
    table_psments: false,
    pop_loading: false,
  }),
  mutations: {
    ADD_BOOKING(state, booking) {
      state.bookings.unshift(booking);
    },
    GET_BOOKINGS(state, booking) {
      state.bookings.splice(0, state.bookings.length);
      booking.forEach((element) => {
        state.bookings.push(element);
      });
    },
    DELETE_BOOKING(state, booking) {
      let index = state.bookings.findIndex((e) => e.id == booking.id);
      state.bookings.splice(index, 1);
    },
    EDIT_BOOKING(state, booking) {
      let index = state.bookings.findIndex(
        (element) => element.id === booking.id
      );
      state.bookings.splice(index, 1);
      state.bookings.unshift(booking);
    },
    GET_USERS(state, user) {
      state.users.splice(0, state.users.length);
      user.forEach((element) => {
        state.users.push(element);
      });
      state.user_state = "done";
    },
    GET_PAMENTS_USER(state, payments) {
      state.payments_user.splice(0, state.payments_user.length);
      payments.debts.forEach((element) => {
        state.payments_user.push(element);
      });
    },

    USERS_DREPDWON_SUCCESS(state, user) {
      if (user.length == 0) {
        state.user_state = "finished";
        if (state.params_users.page > 1)
          state.params_users.page = state.params_users.page - 1;
        return;
      }
      state.params_users.page = state.params_users.page + 1;
      user.forEach((element) => {
        state.users.push(element);
      });
      state.user_state = "done";
    },
    ADD_TO_ARCHIVE(state, booking) {
      let item;
      state.bookings.forEach((e) => {
        if (e.id === booking.booking_id) {
          item = e;
        }
      });
      item.booking_status = 1;
      let index = state.bookings.findIndex(
        (element) => element.id === booking.booking_id
      );
      state.bookings.splice(index, 1);
      state.bookings.unshift(item);
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.date_from = null;
      state.date_to = null;
      state.payment_method = null;
      state.bookings = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    add_booking({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_booking = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_booking",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_booking = false;
            commit("ADD_BOOKING", response.data.result[0]);
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
            state.loading_add_booking = false;
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
    get_bookings({ commit, state, rootState }) {
      state.loading_product = true;
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        var filter_date = "";
        var filter = "";
        // اذا قام الدكتور بطلب الحجوزات تاتي فقط حجوزاته
        if (
          state.doctor_id != undefined &&
          state.doctor_id != null &&
          state.doctor_id.length > 0
        ) {
          data = { name: "doctor_id", value: state.doctor_id };
          filter = "&filter=" + JSON.stringify(data);
        }
        // فلترة لجلب النقد و الاجل
        if (state.payment_method != undefined && state.payment_method != null) {
          filter = "&filter=" + JSON.stringify(state.payment_method);
        }

        // بحث عن حجز معين
        if (
          state.booking_query != undefined &&
          state.booking_query != null &&
          state.booking_query.length > 0
        )
          query = `&query=${state.booking_query}`;

        // فلتره من تاريخ معين الي تاريخ معين اخر
        if (state.date_from != null) {
          if (state.date_to == null || state.date_to == undefined) {
            state.date_to = state.date_from;
          } else if (state.date_to < state.date_from) {
            state.date_to = state.date_from;
          }
          let date = { start_date: state.date_from, end_date: state.date_to };
          filter_date = "&filter_date=" + JSON.stringify(date);
        }

        axios({
          url:
            `${rootState.server}` +
            "/api/get_bookings" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query +
            filter +
            filter_date,
          method: "get",
        })
          .then((response) => {
            state.pageCount = response.data.count;
            state.table_loading = false;
            commit("GET_BOOKINGS", response.data.result);
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
    get_debt({ commit, state, rootState }) {
      let data = state.params_payments;
      state.table_payments_loading = true;
      state.loading_debt = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let booking_id = "";
        if (
          state.booking_id != undefined &&
          state.booking_id != null &&
          state.booking_id.length > 0
        )
          booking_id = `&booking_id=${state.booking_id}`;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_bookings" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            booking_id,
          method: "get",
        })
          .then((response) => {
            state.pageCount3 = response.data.count;
            state.table_payments_loading = false;
            commit("GET_PAMENTS_USER", response.data.result[0]);
            resolve(response);
          })
          .catch(() => {
            state.loading_debt = false;
            state.table_payments_loading = false;
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
      let data = state.params_users;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        var filter = "&filter=" + JSON.stringify(state.filter);
        axios({
          url:
            `${rootState.server}` +
            "/api/get_users" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            filter,
          method: "get",
        })
          .then((response) => {
            state.pageCount2 = response.data.count;
            if (data.dropdown == false) {
              commit("GET_USERS", response.data.result);
            } else {
              commit("USERS_DREPDWON_SUCCESS", response.data.result);
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

    edit_booking({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/edit_booking",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "put",
        })
          .then((response) => {
            state.pop_loading = false;
            commit("EDIT_BOOKING", response.data.result[0]);
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
    delete_booking({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/delete_booking",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((response) => {
            commit("DELETE_BOOKING", data);
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
    add_archive({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_archive",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.pop_loading = false;
            if (data.check == 1) {
              commit("ADD_TO_ARCHIVE", response.data.result[0]);
            }

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
    send_message({ commit, state, rootState }, data) {
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/send_message",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.pop_loading = false;
            let snack_message = {};
            snack_message["color"] = "#21ce8f";
            snack_message["icon"] = "clarity:success-standard-solid";
            snack_message["text"] = "تم بنجاح";
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
            snack_message["text"] = "حدث خطا اثناء الاتصال بسيرفر";
            commit("SNACK_MESSAGE", snack_message, { root: true });
            setTimeout(() => {
              commit("TIME_OUT", snack_message, { root: true });
            }, 4000);
          });
      });
    },

    add_order_to_pharmcy({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.pop_loading = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/order_doctor_to_pharmcy",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.pop_loading = false;
            commit("ADD_TO_ARCHIVE", response.data.result[0]);
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
export default bookings;
