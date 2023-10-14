<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="orders_doctor_pharmcy"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول طلبات العيادة</v-toolbar-title>
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
                v-model="orders_doctor_query"
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
                {{ item.booking.booking_code }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.patint_name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.doctor.name }}
              </td>
              <td class="text-center font-weight-black py-2">
                <div
                  v-for="(data, index) in Object.assign(
                    JSON.parse(item.medicens)
                  )"
                  :key="index + item.id">
                  <h4
                    v-for="(objKey, indexkey) in Object.keys(data)"
                    :key="indexkey">
                    {{ index + 1 }} - {{ objKey }}
                  </h4>
                </div>
              </td>
              <td class="text-center font-weight-black">
                <div
                  v-for="(data, index) in Object.assign(
                    JSON.parse(item.medicens)
                  )"
                  :key="index + item.id">
                  <h4
                    v-for="(objKey, indexkey) in Object.keys(data)"
                    :key="indexkey">
                    {{ index + 1 }} - {{ data[objKey] }}
                  </h4>
                </div>
              </td>
              <td class="text-center font-weight-black" dir="ltr">
                {{ moment(item.updated_at).format("YYYY-MM-DD h:s A") }}
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
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  export default {
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
            text: "رقم الطلب",
            value: "booking_code",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اسم الزبون",
            value: "medicen_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الدكتور",
            value: "doctor",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "العلاج",
            value: "medicens",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "وقت العلاج",
            value: "medicens",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "تاريخ الوصفة",
            value: "updated_at",
            class: "secondary white--text title",
            align: "center",
          },
        ],
      };
    },
    computed: {
      orders_doctor_query: {
        set(val) {
          this.$store.state.orders_pharmcy.orders_doctor_query = val;
        },
        get() {
          return this.$store.state.orders_pharmcy.orders_doctor_query;
        },
      },
      pageCount() {
        return this.$store.state.orders_pharmcy.pageCount2;
      },

      orders_doctor_pharmcy() {
        return this.$store.state.orders_pharmcy.orders_doctor_pharmcy;
      },
      loading() {
        return this.$store.state.orders_pharmcy.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.orders_pharmcy.params_orders_doctor = val;
        },
        get() {
          return this.$store.state.orders_pharmcy.params_orders_doctor;
        },
      },
    },
    methods: {
      // جلب الطلبات العيادة
      get_orders_doctor_paharmcy() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("orders_pharmcy/get_orders_doctor_paharmcy");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_orders_doctor_paharmcy();
          this.pagination.page = 1;
        }, 1000);
      },

      popViewDetails(item) {
        this.data_view.push(item);
        this.pop_view = true;
      },
      popClose() {
        this.pop_view = false;
        this.data_view = [];
      },

      reset_table() {
        this.$store.dispatch("orders_pharmcy/reset_table2");
        this.get_orders_doctor_paharmcy();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_orders_doctor_paharmcy();
        },
        deep: true,
      },
    },
  };
</script>
