import axios from "axios";
const archives = {
  namespaced: true,
  state: () => ({
    archives: [],
    archive_query: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    doctor_id: null,
    table_loading: false,
  }),
  mutations: {
    GET_ARCHIVES(state, archive) {
      state.archives.splice(0, state.archives.length);
      archive.forEach((element) => {
        state.archives.push(element);
      });
    },
  },
  actions: {
    async reset_table({ state }) {
      state.pageCount = 1;
      state.archives = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },

    get_archives({ commit, state, rootState }) {
      let data = state.params;
      state.table_loading = true;
      return new Promise((resolve) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;

        let query = "";
        let doctor_id = "";
        if (
          state.archive_query != undefined &&
          state.archive_query != null &&
          state.archive_query.length > 0
        )
          query = `&query=${state.archive_query}`;
        if (state.doctor_id) doctor_id = `&doctor_id=${state.doctor_id}`;
        axios({
          url:
            `${rootState.server}` +
            "/api/get_archives" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            doctor_id +
            query,
          method: "get",
        })
          .then((response) => {
            state.pageCount = response.data.count;
            commit("GET_ARCHIVES", response.data.result);
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
  },
};
export default archives;
