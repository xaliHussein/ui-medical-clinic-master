<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول المستخدمين</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="reset_table"
                    fab
                    icon
                    x-small
                    v-bind="attrs"
                    v-on="on">
                    <Icon
                      icon="solar:smartphone-update-bold"
                      color="#159895"
                      width="30" />
                  </v-btn>
                </template>
                <span>تحديث معلومات الجدول</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="user_query"
                @input="query_change"
                append-icon="mdi-magnify"
                label="بحث"
                class="font-weight-black"
                color="#159895"
                outlined
                rounded
                clearable
                hide-details />
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center font-weight-black">
                {{ item.name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.user_name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.phone_number }}
              </td>
              <td class="text-center font-weight-black" v-if="item.clinic">
                {{ item.clinic.clinic_name }}
              </td>
              <td class="text-center font-weight-black" v-else>غير متاح !!</td>

              <td
                class="text-center font-weight-black"
                v-if="item.user_type == 0">
                مدير نظام
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.user_type == 1">
                مدير عيادة
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.user_type == 2">
                دكتور
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.user_type == 3">
                سكرتير
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.user_type == 4">
                صيدلي
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="popDelete(item.id)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="ic:round-delete-forever"
                        color="#C62828"
                        width="32" />
                    </v-btn>
                  </template>
                  <span>حذف العيادة</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="popEdit(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:edit-document-rounded"
                        color="#37474F"
                        width="32" />
                    </v-btn>
                  </template>
                  <span>تعديل معلومات المستخدم</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div class="text-center py-5">
          <v-row>
            <v-col cols="5" sm="5" md="3" lg="3">
              <v-pagination
                v-model="pagination.page"
                :length="pageCount"
                circle
                color="#159895"></v-pagination>
            </v-col>
            <v-col cols="5" sm="5" md="3" lg="3">
              <v-select
                v-model="pagination.itemsPerPage"
                :items="items"
                color="#159895"
                outlined
                rounded
                single-line
                hide-details
                reverse
                label="عدد العناصر"></v-select>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </div>

        <PopDelete
          :value="pop_delete"
          v-on:popClose="pop_delete = !pop_delete"
          v-on:deleteUser="deleteUser()" />
        <PopEdit
          :value="pop_edit"
          :user="data_editor"
          v-on:popClose="pop_edit = !pop_edit" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/users/PopDelete.vue";
  import PopEdit from "@/components/users/PopEdit.vue";
  export default {
    components: { PopDelete, PopEdit },
    data() {
      return {
        pop_delete: false,
        data_deleted: null,
        pop_edit: false,
        data_editor: null,
        items: [5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "الاسم",
            value: "user_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اسم المستخدم",
            value: "user_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اسم العيادة",
            value: "clinic_id",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "نوع الحساب",
            value: "user_type",
            class: "secondary white--text title",
            align: "center",
          },

          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
          },
        ],
        adverstments: [],
      };
    },
    computed: {
      user_query: {
        set(val) {
          this.$store.state.users.user_query = val;
        },
        get() {
          return this.$store.state.users.user_query;
        },
      },
      pageCount() {
        return this.$store.state.users.pageCount2;
      },

      users() {
        return this.$store.state.users.users;
      },
      loading() {
        return this.$store.state.users.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.users.params_user = val;
        },
        get() {
          return this.$store.state.users.params_user;
        },
      },
    },
    methods: {
      // جلب المستخدمين
      get_users() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("users/get_users");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_users();
          this.pagination.page = 1;
        }, 1000);
      },

      popDelete(item) {
        this.data_deleted = item;
        this.pop_delete = true;
      },
      popEdit(item) {
        this.data_editor = item;
        this.pop_edit = true;
      },
      // حذف المستخدم
      deleteUser() {
        let data = {};
        data["id"] = this.data_deleted;
        this.$store.dispatch("users/delete_user", data).then(() => {
          this.pop_delete = false;
          this.data_deleted = null;
        });
      },
      reset_table() {
        this.$store.dispatch("users/reset_table");
        this.get_users();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_users();
        },
        deep: true,
      },
    },
  };
</script>
