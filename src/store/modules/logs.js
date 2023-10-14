import axios from "axios";
const logs = {
  namespaced: true,
  state: () => ({
    logs: [],
    pie_profits: {},
    pie_losses: {},
    employees: [],
    statistics: [],
    log_query: "",
    pageCount: 1,
    pageCount2: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    params_employee: {
      dropdown: true,
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    employee_state: "done",
    date_from: null,
    date_to: null,
    status: null,

    table_loading: false,
    loading_add_log: false,
    loading_statistics: false,
  }),
  mutations: {
    GET_LOGS(state, logs) {
      state.logs.splice(0, state.logs.length);
      logs.forEach((element) => {
        state.logs.push(element);
      });
    },
    ADD_LOG(state, log) {
      state.logs.unshift(log);
    },
    GET_STATISTICS(state, statistics) {
      let chartData = {};
      let labels = [];
      let pie_data = [];
      let object = {};
      let datasets = [];
      let chartData_2 = {};
      let labels_2 = [];
      let pie_data_2 = [];
      let object_2 = {};
      let datasets_2 = [];
      let data = [
        {
          title: "ربح اليوم",
          statistics: statistics.profit_day,
          color: "#70e000",
          icon: "pajamas:todo-done",
        },
        {
          title: "مصاريف اليوم",
          statistics: statistics.loss_day,
          color: "#FF9800",
          icon: "fluent:receipt-money-24-filled",
        },
      ];

      labels.push("الربح الاسبوعي");
      pie_data.push(statistics.profit_week);
      labels.push("الربح الشهري");
      pie_data.push(statistics.profit_month);
      labels.push("الربح السنوي");
      pie_data.push(statistics.profit_year);
      labels_2.push("الصرفيات الاسبوية");
      pie_data_2.push(statistics.loss_week);
      labels_2.push("الصرفيات الشهرية");
      pie_data_2.push(statistics.loss_month);
      labels_2.push("الصرفيات السنوية");
      pie_data_2.push(statistics.loss_year);

      object["backgroundColor"] = ["#c89f9c", "#219ebc", "#fcbf49"];
      object_2["backgroundColor"] = ["#D7385E", "#1EAFED", "#21ce8f"];
      object["data"] = pie_data;
      datasets.push(object);
      object_2["data"] = pie_data_2;
      datasets_2.push(object_2);

      chartData["labels"] = labels;
      chartData["datasets"] = datasets;
      chartData_2["labels"] = labels_2;
      chartData_2["datasets"] = datasets_2;

      state.pie_profits = chartData;
      state.pie_losses = chartData_2;
      state.statistics = data;
    },

    // الموظفين

    GET_EMPlOYEES(state, employee) {
      state.employees.splice(0, state.employees.length);
      employee.forEach((element) => {
        state.employees.push(element);
      });
      state.employee_state = "done";
    },
    EMPlOYEES_DREPDWON_SUCCESS(state, employee) {
      if (employee.length == 0) {
        state.employee_state = "finished";
        if (state.params_employee.page > 1)
          state.params_employee.page = state.params_employee.page - 1;
        return;
      }
      state.params_employee.page = state.params_employee.page + 1;
      employee.forEach((element) => {
        state.employees.push(element);
      });
      state.employee_state = "done";
    },
  },
  actions: {
    async reset_table({ state }) {
      state.date_from = null;
      state.date_to = null;
      state.status = null;
      state.pageCount = 1;
      state.logs = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    add_log({ commit, state, rootState }, data) {
      state.table_loading = true;
      state.loading_add_log = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/add_to_log",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
        })
          .then((response) => {
            state.table_loading = false;
            state.loading_add_log = false;
            commit("ADD_LOG", response.data.result[0]);
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
            state.loading_add_log = false;
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
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        var filter_date = "";
        var filter = "";
        if (
          state.log_query != undefined &&
          state.log_query != null &&
          state.log_query.length > 0
        )
          query = `&query=${state.log_query}`;

        // فلترة لجلب السحب و والايداع
        if (state.status != undefined && state.status != null) {
          filter = "&filter=" + JSON.stringify(state.status);
        }

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
            "/api/get_logs" +
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
            state.table_loading = false;
            state.pageCount = response.data.count;
            commit("GET_LOGS", response.data.result);
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
    get_statistics({ commit, state, rootState }) {
      state.loading_statistics = true;
      return new Promise((resolve) => {
        axios({
          url: `${rootState.server}` + "/api/get_statistics",
          method: "get",
        })
          .then((response) => {
            state.loading_statistics = false;
            commit("GET_STATISTICS", response.data);
            resolve(response);
          })
          .catch(() => {
            state.loading_statistics = false;
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
    get_employees({ commit, state, rootState }) {
      let data = state.params_employee;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        axios({
          url:
            `${rootState.server}` +
            "/api/get_employees" +
            "?skip=" +
            skip +
            "&limit=" +
            limit,
          method: "get",
        })
          .then((response) => {
            state.pageCount2 = response.data.count;
            if (data.dropdown == false) {
              commit("GET_EMPlOYEES", response.data.result);
            } else {
              commit("EMPlOYEES_DREPDWON_SUCCESS", response.data.result);
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
  },
};
export default logs;
