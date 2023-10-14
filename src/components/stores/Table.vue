<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="stores"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول مخزن الادوية</v-toolbar-title>
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
                v-model="store_query"
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
                {{ item.product_name }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.buy_price | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.price | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.quantity }}
              </td>

              <td
                class="text-center font-weight-black"
                v-if="item.company != null">
                {{ item.company }}
              </td>
              <td class="text-center font-weight-black" v-else>لايوجد</td>
              <td class="text-center font-weight-black">
                {{ item.expaired }}
              </td>
              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="popViewDetails(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:display-settings-rounded"
                        color="#004D40"
                        width="32" />
                    </v-btn>
                  </template>
                  <span>عرض</span>
                </v-tooltip>
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
                  <span>تعديل معلومات المنتج</span>
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

        <PopViewDetails
          :value="pop_view"
          v-on:popClose="popClose()"
          :view_details="data_view" />
        <PopDelete
          :value="pop_delete"
          v-on:popClose="pop_delete = !pop_delete"
          v-on:deleteStore="deleteStore()" />
        <PopEdit
          :value="pop_edit"
          :stores="data_editor"
          v-on:popClose="pop_edit = !pop_edit" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/stores/PopDelete.vue";
  import PopEdit from "@/components/stores/PopEdit.vue";
  import PopViewDetails from "@/components/stores/popViewDetails.vue";
  export default {
    components: { PopViewDetails, PopDelete, PopEdit },
    data() {
      return {
        pop_view: false,
        data_view: [],
        pop_delete: false,
        data_deleted: null,
        pop_edit: false,
        data_editor: null,
        items: [5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "اسم المنتج",
            value: "product_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "سعر الشراء",
            value: "buy_price",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "سعر البيع",
            value: "price",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الكمية",
            value: "quantity",
            class: "secondary white--text title",
            align: "center",
          },

          {
            text: "الشركة",
            value: "company",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "تاريخ الصلاحية",
            value: "expaired",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "عرض تفاصيل",
            value: "view",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },

          {
            text: "العمليات",
            value: "image",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },
    computed: {
      store_query: {
        set(val) {
          this.$store.state.stores.store_query = val;
        },
        get() {
          return this.$store.state.stores.store_query;
        },
      },
      pageCount() {
        return this.$store.state.stores.pageCount;
      },

      stores() {
        return this.$store.state.stores.stores;
      },
      loading() {
        return this.$store.state.stores.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.stores.params = val;
        },
        get() {
          return this.$store.state.stores.params;
        },
      },
    },
    methods: {
      // جلب مواد المخزن
      get_stores() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("stores/get_stores");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_stores();
          this.pagination.page = 1;
        }, 1000);
      },

      popDelete(item) {
        this.data_deleted = item;
        this.pop_delete = true;
      },
      popViewDetails(item) {
        this.data_view.push(item);
        this.pop_view = true;
      },
      popClose() {
        this.pop_view = false;
        this.data_view = [];
      },
      popEdit(item) {
        this.data_editor = item;
        this.pop_edit = true;
      },
      // حذف دواء من المخزن
      deleteStore() {
        let data = {};
        data["id"] = this.data_deleted;
        this.$store.dispatch("stores/delete_medicine", data).then(() => {
          this.pop_delete = false;
          this.data_deleted = null;
        });
      },
      reset_table() {
        this.$store.dispatch("stores/reset_table");
        this.get_stores();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_stores();
        },
        deep: true,
      },
    },
  };
</script>
