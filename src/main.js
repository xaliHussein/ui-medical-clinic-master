import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/iconify";
import "./plugins/moment";
import "./plugins/UploadImage";
import "./plugins/filterPrice";
import Axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
}

Axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.result != undefined && response.data.code != 200) {
      return Promise.reject(response.data.errors);
    }
    return response;
  },
  function (error) {
    // console.log(error.response.status);
    //error.response.status

    if (error.response.status == 402) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_name");
      localStorage.removeItem("clinic_id");
      localStorage.removeItem("clinic");
      // localStorage.removeItem("phone_number");

      store.state.token = null;
      // let numberOfEntries = window.history.length;
      // for (let index = 0; index < numberOfEntries - 1; index++) {
      //   router.go(-1);
      // }
      router.replace("/login");
    }
    // // console.log(error.response.data.message)
    let message = error.response.data.message;
    Object.keys(error.response.data.errors).forEach((element) => {
      message = message + "\n" + error.response.data.errors[element][0];
    });
    error.response.data.message = message;
    // // console.log(message)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
