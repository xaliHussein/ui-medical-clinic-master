import axios from "axios";
const pharmacies = {
  namespaced: true,
  state: () => ({
    orders_pharmcy: [],
    pharmacy_requests: [],
    total_price: 0,
    orders_doctor_pharmcy: [],
    orders_query: "",
    orders_doctor_query: "",
    pageCount: 1,
    pageCount2: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_orders_doctor: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },

    loading_add_order: false,
    loading_btn: false,
    table_loading: false,
  }),
  mutations: {
    // POS
    GET_ORDER_PHARMCY(state, order) {
      let chack_goods = false;
      if (order.length == 1) {
        state.pharmacy_requests.forEach((e) => {
          if (e.id == order[0].id) {
            chack_goods = true;
          }
        });
        if (chack_goods == false) {
          let ProductData = {};
          order.forEach((element) => {
            if (element.quantity != 0) {
              ProductData["id"] = element.id;
              ProductData["quantity"] = 1;
              ProductData["medicen_name"] = element.medicen_name;
              ProductData["company"] = element.company;
              ProductData["price"] = element.price;
              ProductData["available_quantity"] = element.quantity - 1;
              state.total_price += element.price; //element.price
              state.pharmacy_requests.push(ProductData);
            } else {
              let snack_message = {};
              snack_message["color"] = "#F57C00";
              snack_message["icon"] = "mdi:alert-circle";
              snack_message["text"] = "نفذت الكميه";
              this.commit("SNACK_MESSAGE", snack_message);
              setTimeout(() => {
                this.commit("TIME_OUT", snack_message);
              }, 4000);
            }
          });
        }
      } else {
        let snack_message = {};
        snack_message["color"] = "#F57C00";
        snack_message["icon"] = "mdi:alert-circle";
        snack_message["text"] = "ادخلت اسم منتج او باركود غير متوفر";
        this.commit("SNACK_MESSAGE", snack_message, { root: true });
        setTimeout(() => {
          this.commit("TIME_OUT", snack_message, { root: true });
        }, 4000);
      }
      state.lodding_table = false;
    },
    // احضار طلبات الصيدلية
    GET_ORDERS_PHARMCY(state, order) {
      state.orders_pharmcy.splice(0, state.orders_pharmcy.length);
      order.forEach((element) => {
        state.orders_pharmcy.push(element);
      });
    },
    // احضار طلبات الدواء من العيادة
    GET_ORDERS_DOCTOR_PHARMCY(state, order) {
      state.orders_doctor_pharmcy.splice(0, state.orders_doctor_pharmcy.length);
      order.forEach((element) => {
        state.orders_doctor_pharmcy.push(element);
      });
    },
    // انشاء طلب من الصيدلية
    MAKE_ORDER_PHARMCY(state, order) {
      state.orders_pharmcy.unshift(order);
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.orders_pharmcy = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async reset_table2({ state }) {
      state.pageCount2 = 1;
      state.orders_doctor_pharmcy = [];
      state.table_loading = false;
      state.params_orders_doctor = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    get_order_pharmcy({ commit, state, rootState }) {
      state.table_loading = true;
      return new Promise((resolve) => {
        let query = "";
        if (
          state.products_query != undefined &&
          state.products_query != null &&
          state.products_query.length > 0
        )
          query = `?query=${state.products_query}`;
        axios({
          url: `${rootState.server}` + "/api/get_pharmacy" + query,
          method: "get",
        })
          .then((response) => {
            state.table_loading = false;
            commit("GET_ORDER_PHARMCY", response.data.result);
            resolve(response);
          })
          .catch((err) => {
            state.table_loading = false;
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
    get_orders_pharmcy({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.orders_query != undefined &&
          state.orders_query != null &&
          state.orders_query.length > 0
        )
          query = `&query=${state.orders_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_orders_pharmcy" +
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
            commit("GET_ORDERS_PHARMCY", response.data.result);
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
    get_orders_doctor_paharmcy({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        if (
          state.orders_doctor_query != undefined &&
          state.orders_doctor_query != null &&
          state.orders_doctor_query.length > 0
        )
          query = `&query=${state.orders_doctor_query}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_orders_doctor_to_paharmcy" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount2 = response.data.count;
            state.table_loading = false;
            commit("GET_ORDERS_DOCTOR_PHARMCY", response.data.result);
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
    make_order_pharmcy({ commit, state, rootState }, data) {
      state.loading_btn = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/make_order_pharmcy",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            commit("MAKE_ORDER_PHARMCY", response.data.result);
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
            state.loading_btn = false;
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
  },
};
export default pharmacies;
