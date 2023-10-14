<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="representatives"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول المندوبين</v-toolbar-title>
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
                v-model="representative_query"
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
                {{ item.phone_number }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.paided | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.depted | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ (item.depted - item.paided) | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.company_name }}
              </td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="ViewPayments(item.id)"
                      :loading="item.id == index_id ? loading_pament : false"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="solar:chat-round-money-bold"
                        color="#159895"
                        width="30" />
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon color="white">mdi-cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </template>
                  <span>الدفعات</span>
                </v-tooltip>

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
                  <span>حذف المندوب</span>
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
                  <span>تعديل معلومات العيادة</span>
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
          v-on:deleteRepresentative="deleteRepresentative()" />
        <PopEdit
          :value="pop_edit"
          :representative="data_editor"
          v-on:popClose="pop_edit = !pop_edit" />
        <ViewPayments
          :value="pop_payment"
          :payments="data_payments"
          v-on:popClose="pop_payment = !pop_payment" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/representatives/PopDelete.vue";
  import PopEdit from "@/components/representatives/PopEdit.vue";
  import ViewPayments from "@/components/representatives/ViewPayments.vue";
  export default {
    components: { PopDelete, PopEdit, ViewPayments },
    data() {
      return {
        pop_payment: false,
        index_id: null,
        data_payments: null,
        pop_delete: false,
        data_deleted: null,
        pop_edit: false,
        data_editor: null,
        items: [1, 5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "اسم المندوب",
            value: "name",
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
            text: "المبلغ مدفوعة",
            value: "paided",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "المبلغ المديون",
            value: "depted",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "المبلغ المتبقي",
            value: "total",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "اسم الشركة",
            value: "image",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },

          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },
    computed: {
      representative_query: {
        set(val) {
          this.$store.state.representatives.representative_query = val;
        },
        get() {
          return this.$store.state.representatives.representative_query;
        },
      },
      pageCount() {
        return this.$store.state.representatives.pageCount;
      },

      representatives() {
        return this.$store.state.representatives.representatives;
      },
      loading() {
        return this.$store.state.representatives.table_loading;
      },
      loading_pament() {
        return this.$store.state.representatives.loading_payments;
      },
      params: {
        set(val) {
          this.$store.state.representatives.params = val;
        },
        get() {
          return this.$store.state.representatives.params;
        },
      },
    },
    methods: {
      // جلب المندوبين
      get_representatives() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("representatives/get_representatives");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_representatives();
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
      ViewPayments(id) {
        this.index_id = id;
        this.$store.state.representatives.representative_id = id;
        this.$store.dispatch("representatives/get_logs").then(() => {
          this.pop_payment = true;
          this.index_id = null;
        });
      },
      // حذف مندوب
      deleteRepresentative() {
        let data = {};
        data["id"] = this.data_deleted;
        this.$store
          .dispatch("representatives/delete_representative", data)
          .then(() => {
            this.pop_delete = false;
            this.data_deleted = null;
          });
      },
      reset_table() {
        this.$store.dispatch("representatives/reset_table");
        this.get_representatives();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_representatives();
        },
        deep: true,
      },
    },
  };
</script>
