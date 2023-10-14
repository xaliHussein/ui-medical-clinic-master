<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="debts"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الديون</v-toolbar-title>
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
                v-model="debt_query"
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
            <tr v-if="item.booking != null">
              <td class="text-center font-weight-black">
                {{ item.booking.booking_code }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.patint_name }}
              </td>
              <td class="text-center font-weight-black">
                <v-tooltip bottom v-if="item.booking.status_paid == 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="solar:money-bag-bold"
                        color="#159895"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>تم دفع جميع الديون</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.booking.status_paid == 1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="solar:money-bag-bold"
                        color="#FF9800"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>يتوفر ديون متبقية</span>
                </v-tooltip>
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.phone_number }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.booking.price | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.value_remaining | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.payment_date }}
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
                  <span>حذف الموظف</span>
                </v-tooltip>
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
                  <span>معلومات الزبون</span>
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
          v-on:deleteDebt="deleteDebt()" />
        <PopViewDetails
          :value="pop_view"
          v-on:popClose="popClose()"
          :view_details="data_view" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/debts/PopDelete.vue";
  import PopViewDetails from "@/components/debts/PopViewDetails.vue";
  export default {
    components: { PopDelete, PopViewDetails },
    data() {
      return {
        pop_view: false,
        data_view: [],
        pop_delete: false,
        data_deleted: null,

        items: [1, 5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "رقم الحجز",
            value: "booking_code",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اسم الزبون",
            value: "patint_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الحالة",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "المبلغ الكلي",
            value: "price",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "المتبقي",
            value: "value_remaining",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "تاريخ اخر دفعه",
            value: "payment_date",
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
        adverstments: [],
      };
    },
    computed: {
      debt_query: {
        set(val) {
          this.$store.state.debts.debt_query = val;
        },
        get() {
          return this.$store.state.debts.debt_query;
        },
      },
      pageCount() {
        return this.$store.state.debts.pageCount;
      },

      debts() {
        return this.$store.state.debts.debts;
      },
      loading() {
        return this.$store.state.debts.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.debts.params = val;
        },
        get() {
          return this.$store.state.debts.params;
        },
      },
    },
    methods: {
      // جلب الموظفين
      get_debts() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("debts/get_debts");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_debts();
          this.pagination.page = 1;
        }, 1000);
      },

      popDelete(item) {
        this.data_deleted = item;
        this.pop_delete = true;
      },

      popClose() {
        this.pop_view = false;
        this.data_view = [];
      },

      // عرض تفاصيل الزبون
      popViewDetails(item) {
        this.data_view.push(item);
        this.pop_view = true;
      },
      // حذف الموظف
      deleteDebt() {
        this.$store
          .dispatch("debts/delete_debt", { id: this.data_deleted })
          .then(() => {
            this.pop_delete = false;
            this.data_deleted = null;
          });
      },
      reset_table() {
        this.$store.dispatch("debts/reset_table");
        this.get_debts();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_debts();
        },
        deep: true,
      },
    },
  };
</script>
