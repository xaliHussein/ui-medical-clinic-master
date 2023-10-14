import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import clinics from "./modules/clinics";
import users from "./modules/users";
import employees from "./modules/employees";
import representatives from "./modules/representatives";
import stores from "./modules/stores";
import bookings from "./modules/bookings";
import archives from "./modules/archives";
import font from "./modules/font";
import pharmacies from "./modules/pharmacies";
import debts from "./modules/debts";
import orders_pharmcy from "./modules/orders_pharmcy";
import logs from "./modules/logs";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    server: "http://127.0.0.1:8000",
    snackbar: false,
    snack_message: {},
    token: localStorage.getItem("token"),
    user_name: localStorage.getItem("user_name"),
    user_type: localStorage.getItem("user_type"),
    clinic_id: localStorage.getItem("clinic_id") ?? null,
    api_key: localStorage.getItem("api_key") ?? null,
    clinic_name: localStorage.getItem("clinic_name") ?? null,
    image_clinic: localStorage.getItem("image_clinic") ?? null,
    doctor_id: localStorage.getItem("doctor_id") ?? null,
    loading_login: false,
  },

  mutations: {
    SNACK_MESSAGE(state, snack_message) {
      state.snack_message = snack_message;
      state.snackbar = true;
    },
    TIME_OUT(state) {
      state.snackbar = false;
      state.snack_message = null;
    },
    LOGIN_USER(state, data) {
      state.user_name = data.result[0].user_name;
      state.phone_number = data.result[0].phone_number;
      state.user_type = data.result[0].user_type;
      if (data.result[0].user_type == 2) {
        state.doctor_id = data.result[0].id;
      }
      if (data.result[0].user_type != 0) {
        state.clinic_id = data.result[0].clinic_id;
        if (data.result[0].clinic_id.api_key != null) {
          state.api_key = data.result[0].api_key;
        }
        state.clinic_id = data.result[0].clinic_id;
        state.clinic_name = data.result[0].clinic_name;
      }
    },
    CLEAR_USER(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      if (state.user_type == 2) {
        localStorage.removeItem("doctor_id");
      }
      if (state.user_type != 0) {
        localStorage.removeItem("clinic_id");
        localStorage.removeItem("api_key");
        localStorage.removeItem("clinic_name");
        localStorage.removeItem("image_clinic");
      }
      localStorage.removeItem("user_type");

      delete axios.defaults.headers.common["Authorization"];
      location.reload();
    },
  },
  actions: {
    login({ commit, state }, data) {
      state.loading_login = true;
      return new Promise((resolve, reject) => {
        axios({
          url: `${state.server}` + "/api/login",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((response) => {
            const token = response.data.token;
            const data = response.data;
            commit("LOGIN_USER", data);
            state.loading_login = false;
            Vue.prototype.$http.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            localStorage.setItem("token", token);
            localStorage.setItem("user_name", data.result[0].user_name);
            localStorage.setItem("user_type", data.result[0].user_type);
            if (data.result[0].user_type == 2) {
              localStorage.setItem("doctor_id", data.result[0].id);
            }
            if (data.result[0].user_type != 0) {
              localStorage.setItem("clinic_id", data.result[0].clinic_id);
              localStorage.setItem("api_key", data.result[0].clinic.api_key);
              localStorage.setItem(
                "clinic_name",
                data.result[0].clinic.clinic_name
              );
            }

            resolve(response);
          })
          .catch((err) => {
            state.loading_login = false;
            let snack_message = {};
            snack_message["color"] = "#B71C1C";
            snack_message["icon"] = "ri:close-circle-fill";
            snack_message["text"] = "ادخلت اسم مستخدم او كلمة مرور غير صحيحة";
            commit("SNACK_MESSAGE", snack_message);
            setTimeout(() => {
              commit("TIME_OUT", snack_message);
            }, 4000);
          });
      });
    },

    logout({ commit }) {
      commit("CLEAR_USER");
    },
  },
  getters: {
    snack_bar(state) {
      return !!state.snackbar;
    },
  },
  modules: {
    clinics,
    users,
    employees,
    bookings,
    stores,
    representatives,
    archives,
    font,
    pharmacies,
    debts,
    orders_pharmcy,
    logs,
  },
});
