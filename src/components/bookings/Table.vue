<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="filteredItems"
          :items="bookings"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الحجوزات</v-toolbar-title>
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
                v-model="booking_query"
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
                {{ item.patint_name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking_code }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.phone_number }}
              </td>

              <td
                class="text-center font-weight-black"
                v-if="user_type == 1 || user_type == 3">
                {{ item.doctor.name }}
              </td>
              <td class="text-center font-weight-black">
                <v-tooltip bottom v-if="item.booking_status == 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon
                        icon="material-symbols:hourglass-bottom-rounded"
                        color="#FF9800"
                        width="30" />
                    </v-btn>
                  </template>
                  <span>الطلب في حالة الانتضار</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.booking_status == 1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab icon x-small v-bind="attrs" v-on="on">
                      <Icon icon="mdi:book-check" color="#159895" width="30" />
                    </v-btn>
                  </template>
                  <span>تم تحويل معلومات الزبون الى الارشيف</span>
                </v-tooltip>
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.price | formatNumber }}
              </td>
              <td
                class="text-center font-weight-black"
                v-if="
                  item.payment_method == 0 && (user_type == 1 || user_type == 3)
                ">
                نقد
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="
                  item.payment_method == 1 && (user_type == 1 || user_type == 3)
                ">
                آجل
              </td>
              <td class="text-center font-weight-black">
                <!-- date -->
                <div
                  style="color: green"
                  v-if="item.booking_date >= moment().format('YYYY-MM-DD')">
                  {{ item.booking_date }}
                </div>
                <div style="color: red" v-else>{{ item.booking_date }}</div>
                <!-- end -->

                <!-- time -->
                <div
                  style="direction: ltr; color: green"
                  v-if="item.booking_date >= moment().format('YYYY-MM-DD')">
                  {{ moment(item.booking_time, "hh:mm A").format("hh:mm A") }}
                </div>
                <!-- <div style="direction: ltr; color: green" v-else-if="">  {{ moment(item.booking_time, "hh:mm A").format("hh:mm A") }}</div> -->
                <div style="direction: ltr; color: red" v-else>
                  {{ moment(item.booking_time, "hh:mm A").format("hh:mm A") }}
                </div>
                <!-- end -->
              </td>

              <td class="text-center font-weight-black py-1">
                <div>
                  <v-tooltip
                    bottom
                    v-if="
                      item.booking_status == 0 &&
                      user_type == 2 &&
                      moment(item.booking_date).format('YYYY-MM-DD') >=
                        moment().format('YYYY-MM-DD')
                    ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="popAddOrderToPharmcy(item)"
                        :disabled="
                          moment(item.booking_date).format('YYYY-MM-DD') >
                          moment().format('YYYY-MM-DD')
                        "
                        fab
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on">
                        <Icon
                          icon="solar:document-medicine-bold"
                          color="#F06292"
                          width="32" />
                      </v-btn>
                    </template>
                    <span>طباعة وصفة</span>
                  </v-tooltip>
                  <v-tooltip
                    bottom
                    v-if="
                      item.booking_status == 0 &&
                      user_type == 2 &&
                      moment(item.booking_date).format('YYYY-MM-DD') >=
                        moment().format('YYYY-MM-DD')
                    ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="popAddToArchive(item)"
                        :disabled="
                          moment(item.booking_date).format('YYYY-MM-DD') >
                          moment().format('YYYY-MM-DD')
                        "
                        fab
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on">
                        <Icon
                          icon="material-symbols:book"
                          color="#159895"
                          width="32" />
                      </v-btn>
                    </template>
                    <span>اضافة الى الارشيف</span>
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
                  <v-tooltip bottom v-if="api_key != null && user_type == 3">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="SendWhatsAppMessage(item)"
                        fab
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on">
                        <Icon icon="logos:whatsapp-icon" width="32" />
                      </v-btn>
                    </template>
                    <span>ارسال رسالة على واتسب</span>
                  </v-tooltip>
                  <v-tooltip
                    bottom
                    v-if="
                      item.status_paid == 1 &&
                      item.payment_method == 1 &&
                      (user_type == 1 || user_type == 3)
                    ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="popPayment(item)"
                        :loading="item.id == index_id ? loading_debt : false"
                        :disabled="item.booking_status != 1"
                        fab
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on">
                        <Icon
                          icon="fluent:money-hand-24-filled"
                          color="#37474F"
                          width="32" />
                        <template v-slot:loader>
                          <span class="custom-loader">
                            <v-icon color="white">mdi-cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                    </template>
                    <span>تسديد اقصاد</span>
                  </v-tooltip>
                  <v-tooltip
                    bottom
                    v-else-if="
                      item.status_paid == 0 &&
                      item.payment_method == 1 &&
                      (user_type == 1 || user_type == 3)
                    ">
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
                </div>

                <v-tooltip
                  bottom
                  v-if="
                    item.booking_status == 0 &&
                    moment(item.booking_date).format('YYYY-MM-DD') >=
                      moment().format('YYYY-MM-DD')
                  ">
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
                  <span>حذف الحجز</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="
                    item.booking_status == 0 &&
                    moment(item.booking_date).format('YYYY-MM-DD') >=
                      moment().format('YYYY-MM-DD')
                  ">
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
                  <span>تعديل معلومات الحجز</span>
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
            <v-col cols="5" sm="5" md="2" lg="2">
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
            <v-col cols="5" sm="5" md="2" lg="2">
              <Selects
                v-if="this.user_type != 2"
                @update-value="payment_method = $event"
                :value="payment_method"
                label="الدفع"
                itemValue="value"
                itemText="type"
                :items="payment_metd" />
            </v-col>
            <v-col align-self="center" cols="5" sm="5" md="2" lg="2">
              <InputDate
                @update-value="date_from = $event"
                @clearInput="date_from = null"
                :value="date_from"
                label="من تاريخ" />
            </v-col>
            <v-col align-self="center" cols="5" sm="5" md="2" lg="2">
              <InputDate
                @update-value="date_to = $event"
                @clearInput="date_to = null"
                :value="date_to"
                label="الى" />
            </v-col>
          </v-row>
        </div>

        <PopDelete
          :value="pop_delete"
          v-on:popClose="pop_delete = !pop_delete"
          v-on:deleteBooking="deleteBooking()" />
        <PopAddToArchive
          :value="pop_archive"
          :data_archive="data_archive"
          v-on:popClose="pop_archive = !pop_archive" />
        <PopViewDetails
          :value="pop_view"
          v-on:popClose="popClose()"
          :bookings="data_view" />
        <PopEdit
          :value="pop_edit"
          :bookings="data_editor"
          v-on:popClose="pop_edit = !pop_edit" />
        <PopAddOrderToPharmcy
          :dialog="pop_order"
          :bookings="data_order"
          v-on:popClose="pop_order = !pop_order" />
        <Payment
          :value="pop_payment"
          :debts="data_payment"
          v-on:popClose="pop_payment = !pop_payment" />
        <WhatsApp
          :value="pop_whats_app"
          :customer="data_whats_app"
          v-on:popClose="pop_whats_app = !pop_whats_app" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopDelete from "@/components/bookings/PopDelete.vue";
  import PopEdit from "@/components/bookings/PopEdit.vue";
  import InputDate from "@/components/layout/InputDate.vue";
  import Selects from "@/components/layout/Selects.vue";
  import PopViewDetails from "@/components/bookings/PopViewDetails";
  import PopAddOrderToPharmcy from "@/components/bookings/PopAddOrderToPharmcy";
  import PopAddToArchive from "@/components/bookings/PopAddToArchive";
  import Payment from "@/components/bookings/Payment.vue";
  import WhatsApp from "@/components/bookings/WhatsApp.vue";
  export default {
    components: {
      PopViewDetails,
      PopDelete,
      PopEdit,
      InputDate,
      PopAddOrderToPharmcy,
      PopAddToArchive,
      Payment,
      Selects,
      WhatsApp,
    },
    data() {
      return {
        date_from: "",
        date_to: "",
        currentTime: null,
        index_id: null,
        pop_view: false,
        pop_payment: false,
        data_payment: null,
        data_view: [],
        pop_delete: false,
        data_deleted: null,
        pop_edit: false,
        data_order: null,
        pop_order: false,
        data_editor: null,
        pop_archive: false,
        data_archive: null,
        pop_whats_app: false,
        data_whats_app: null,
        items: [5, 10, 15, 20, 25],
        payment_method: null,
        payment_metd: [
          { type: "نقد", name: "payment_method", value: 0 },
          { type: "آجل", name: "payment_method", value: 1 },
        ],
        pagination: {},
        headers: [
          {
            text: "الاسم",
            value: "patint_name",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
          },
          {
            text: "رقم الحجز",
            value: "booking_code",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
            sortable: false,
          },

          {
            text: "الدكتور",
            value: "doctor",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 1,
            type3: 3,
            sortable: false,
          },
          {
            text: "حالة الطلب",
            value: "booking_status",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
            sortable: false,
          },
          {
            text: "السعر",
            value: "price",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
            sortable: false,
          },
          {
            text: " الدفع",
            value: "payment_method",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 1,
            type3: 3,
            sortable: false,
          },
          {
            text: "تاريخ الحجز",
            value: "address",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
          },

          {
            text: "العمليات",
            class: "secondary white--text title",
            align: "center",
            type: 1,
            type2: 2,
            type3: 3,
            sortable: false,
          },
        ],
        adverstments: [],
      };
    },
    mounted() {
      this.getCurrentTime();
    },
    computed: {
      filteredItems() {
        return this.headers.filter(
          (opation) =>
            opation.type == this.user_type ||
            opation.type2 == this.user_type ||
            opation.type3 == this.user_type
        );
      },

      booking_query: {
        set(val) {
          this.$store.state.bookings.booking_query = val;
        },
        get() {
          return this.$store.state.bookings.booking_query;
        },
      },
      pageCount() {
        return this.$store.state.bookings.pageCount;
      },
      api_key() {
        return this.$store.state.api_key;
      },
      loading_debt() {
        return this.$store.state.bookings.loading_debt;
      },
      user_type() {
        return this.$store.state.user_type;
      },

      bookings() {
        return this.$store.state.bookings.bookings;
      },
      loading() {
        return this.$store.state.bookings.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.bookings.params = val;
        },
        get() {
          return this.$store.state.bookings.params;
        },
      },
    },
    methods: {
      getCurrentTime() {
        const options = {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        };
        const now = new Date();
        this.currentTime = now.toLocaleTimeString("en-US", options);
        setInterval(() => {
          this.currentTime = new Date().toLocaleTimeString("en-US", options);
        }, 1000);
      },
      // جلب الحجوزات
      get_bookings() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        if (this.user_type == 2) {
          this.$store.state.bookings.doctor_id = this.$store.state.doctor_id;
        }
        this.$store.dispatch("bookings/get_bookings");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_bookings();
          this.pagination.page = 1;
        }, 1000);
      },
      // حذف الحجز
      popDelete(item) {
        this.data_deleted = item;
        this.pop_delete = true;
      },
      popPayment(item) {
        this.index_id = item.id;
        this.$store.state.bookings.booking_id = item.id;
        this.$store.dispatch("bookings/get_debt").then(() => {
          this.$store.state.bookings.loading_debt = false;
          this.index_id = null;
          this.pop_payment = true;
        });
      },
      // تعديل تفاصيل الحجز
      popEdit(item) {
        this.data_editor = item;
        this.pop_edit = true;
      },
      // عرض تفاصيل الزبون
      popViewDetails(item) {
        this.data_view.push(item);
        this.pop_view = true;
      },
      popAddToArchive(item) {
        this.data_archive = item;
        this.pop_archive = true;
      },
      SendWhatsAppMessage(item) {
        this.data_whats_app = item;
        this.pop_whats_app = true;
      },
      popClose() {
        this.pop_view = false;
        this.data_view = [];
      },

      // طباعة فاتورة
      popAddOrderToPharmcy(item) {
        this.data_order = item;
        this.pop_order = true;
      },

      // حذف حجز
      deleteBooking() {
        let data = {};
        data["id"] = this.data_deleted;
        this.$store.dispatch("bookings/delete_booking", data).then(() => {
          this.pop_delete = false;
          this.data_deleted = null;
        });
      },
      // تحديث معلومات الجدول
      reset_table() {
        this.$store.dispatch("bookings/reset_table").then(() => {
          this.date_to = null;
          this.date_from = null;
        });
        this.get_bookings();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_bookings();
        },
        deep: true,
      },
      payment_method: {
        handler() {
          if (this.user_type != 2) {
            this.$store.state.bookings.payment_method = this.payment_method;
            this.get_bookings();
          }
        },
      },
      date_from: {
        handler() {
          this.$store.state.bookings.date_from = this.date_from;
          this.get_bookings();
        },
      },
      date_to: {
        handler() {
          this.$store.state.bookings.date_to = this.date_to;
          this.get_bookings();
        },
      },
    },
  };
</script>
