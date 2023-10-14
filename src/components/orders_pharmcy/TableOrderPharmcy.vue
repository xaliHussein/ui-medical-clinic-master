<template>
  <v-card class="mx-auto mt-5 card-table" width="100%">
    <v-row class="d-flex justify-center">
      <v-col cols="12" sm="6" md="4" lg="4" class="mt-2">
        <Input
          @update-value="patint_name = $event"
          :value="patint_name"
          type="text"
          label="اسم الزبون" />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4" class="mt-2">
        <Input
          @update-value="patint_age = $event"
          :value="patint_age"
          type="number"
          label="العمر" />
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="4" class="mt-2">
        <Selects
          @update-value="gender = $event"
          :value="gender"
          itemValue="value"
          itemText="type"
          :items="gender_ty"
          label="الجنس" />
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="pharmacy_requests"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول انشاء طلب</v-toolbar-title>
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
                <span>حذف معلومات الجدول</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                ref="barcode"
                v-model="products_query"
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
                {{ item.medicen_name }}
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.price | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                <span>
                  <v-btn
                    icon
                    small
                    @click="plus(item)"
                    style="background-color: #159895"
                    ><v-icon color="white">mdi-plus</v-icon></v-btn
                  >
                  <span class="px-3 black--text">{{ item.quantity }}</span>
                  <v-btn
                    icon
                    small
                    @click="minus(item)"
                    style="background-color: #159895"
                    ><v-icon color="white">mdi-minus</v-icon></v-btn
                  >
                </span>
              </td>
              <td class="text-center font-weight-black">
                {{ item.available_quantity }}
              </td>
              <td
                class="text-center font-weight-black"
                v-if="item.company != null">
                {{ item.company }}
              </td>
              <td class="text-center font-weight-black" v-else>لايوجد</td>

              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="delete_item(item)"
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
                  <span>حذف </span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-card-text class="mr-4" v-if="total_price > 0">
          <h4>المجموع: د.ع {{ total_price | formatNumber }}</h4>
        </v-card-text>
        <v-card-actions v-if="total_price > 0">
          <v-btn
            color="#159895"
            class="px-10 mr-4"
            :loading="loading_btn"
            @click="create_order">
            <h4 style="color: white">تاكيد</h4>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon color="white">mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import autoTable from "jspdf-autotable";
  import moment from "moment";
  import { jsPDF } from "jspdf";
  import Input from "@/components/layout/Input.vue";
  import Selects from "@/components/layout/Selects.vue";
  export default {
    components: { Input, Selects },
    data() {
      return {
        gender: null,
        patint_age: null,
        patint_name: null,
        gender_ty: [
          { type: " ذكر", value: true },
          { type: " انثى", value: false },
        ],
        headers: [
          {
            text: "اسم الدواء",
            value: "medicen_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "السعر",
            value: "price",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الكمية",
            value: "quantity",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "الكمية المتاحة",
            value: "available_quantity",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "الشركة",
            value: "company",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },

          {
            text: "العمليات",
            sortable: false,
            class: "secondary white--text title",
            align: "center",
          },
        ],
      };
    },

    mounted() {
      let data = {};
      data["id"] = localStorage.getItem("clinic_id");
      this.$store.dispatch("clinics/get_image_clinic", data);
    },
    computed: {
      products_query: {
        set(val) {
          this.$store.state.orders_pharmcy.products_query = val;
        },
        get() {
          return this.$store.state.orders_pharmcy.products_query;
        },
      },

      pharmacy_requests() {
        return this.$store.state.orders_pharmcy.pharmacy_requests;
      },
      loading() {
        return this.$store.state.orders_pharmcy.table_loading;
      },
      loading_btn() {
        return this.$store.state.orders_pharmcy.loading_btn;
      },
      total_price() {
        return this.$store.state.orders_pharmcy.total_price;
      },
      clinic_name() {
        return this.$store.state.clinic_name;
      },
      image_clinic() {
        return this.$store.state.image_clinic;
      },
    },
    methods: {
      reset_table() {
        this.$store.state.orders_pharmcy.pharmacy_requests = [];
      },
      create_order() {
        let data = {};
        let medicans = [];

        this.pharmacy_requests.forEach((element) => {
          let object = {};
          object["id"] = element.id;
          object["quantity"] = element.quantity;
          medicans.push(object);
        });

        data["patint_name"] = this.patint_name;
        data["patint_age"] = this.patint_age;
        if (this.gender != null) {
          data["gender"] = this.gender.value;
        }

        data["medicans"] = medicans;
        this.$store
          .dispatch("orders_pharmcy/make_order_pharmcy", data)
          .then((response) => {
            this.exportToPDF(
              this.pharmacy_requests,
              response.data.result[0],
              this.clinic_name
            );
            this.patint_name = null;
            this.patint_age = null;
            this.gender = null;
          });
      },
      exportToPDF(pharmacy_requests, order, clinic_name) {
        const pdf = new jsPDF("p", "pt", "A4");
        var font = this.$store.state.font.font;
        pdf.addFileToVFS("Amiri-Regular-normal.ttf", font);
        pdf.addFont(
          "Amiri-Regular-normal.ttf",
          "Amiri-Regular-normal",
          "normal"
        );
        pdf.setFont("Amiri-Regular-normal");
        pdf.addImage(this.image_clinic, 250, 40, 70, 70);
        pdf.text(262, 135, clinic_name);
        var body = [
          ["رقم الطلب", "التاريخ ", "الجموع الكلي", "اسم الزبون"],
          [
            order.order_code,
            moment().format("YYYY-MM-DD hh:mm A"),
            order.total_cost,
            order.patint_name,
          ],
        ];
        autoTable(pdf, {
          body: body,
          bodyStyles: { halign: "center" },
          margin: { top: 160 },
          styles: { font: "Amiri-Regular-normal" },
        });
        autoTable(pdf, {
          body: pharmacy_requests,
          columns: [
            { header: "الشركة", dataKey: "company" },
            { header: "السعر", dataKey: "price" },
            { header: "الكمية", dataKey: "quantity" },
            { header: "اسم الدواء", dataKey: "medicen_name" },
          ],
          headStyles: { fillColor: [23, 127, 131], halign: "center" },
          bodyStyles: { halign: "center" },
          margin: { top: 173 },
          theme: "grid",
          styles: { font: "Amiri-Regular-normal" },
        });
        pdf.save(order.order_code + ".pdf");

        this.$store.state.orders_pharmcy.pharmacy_requests = [];
        this.$store.state.orders_pharmcy.total_price = 0;
        this.$store.state.orders_pharmcy.loading_btn = false;
      },

      query_change() {
        let products_query = this.$store.state.orders_pharmcy.products_query;
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          if (
            products_query != null &&
            products_query != undefined &&
            products_query.length > 0
          ) {
            this.$store
              .dispatch("orders_pharmcy/get_order_pharmcy")
              .then(() => {
                this.$refs.barcode.reset();
              });
          }
        }, 500);
      },

      // حذف عنصر من جدول
      delete_item(item) {
        let index =
          this.$store.state.orders_pharmcy.pharmacy_requests.findIndex(
            (element) => {
              // يبحث عن المنتج المراد حذفه من الجدول يطابق ال id و الكميه
              if (element.id == item.id && element.quantity == item.quantity) {
                return element.id == item.id;
              }
            }
          );
        this.$store.state.orders_pharmcy.total_price -=
          item.price * item.quantity;
        this.$store.state.orders_pharmcy.pharmacy_requests.splice(index, 1);
      },
      // اضفة في عدد كميه منتج
      plus(item) {
        if (item.available_quantity != 0) {
          let index =
            this.$store.state.orders_pharmcy.pharmacy_requests.findIndex(
              (element) => {
                if (
                  element.id == item.id &&
                  element.quantity == item.quantity
                ) {
                  return element.id == item.id;
                }
              }
            );
          item.quantity += 1;
          item.available_quantity -= 1;
          this.$store.state.orders_pharmcy.total_price += item.price;
          this.$store.state.orders_pharmcy.pharmacy_requests.splice(
            index,
            1,
            item
          );
        } else {
          let snack_message = {};
          snack_message["color"] = "#F57C00";
          snack_message["icon"] = "mdi:alert-circle";
          snack_message["text"] = "نفذت الكميه";
          this.$store.commit("SNACK_MESSAGE", snack_message);
          setTimeout(() => {
            this.$store.commit("TIME_OUT", snack_message);
          }, 4000);
        }
      },
      // نقصان في عدد كميه منتج
      minus(item) {
        if (item.quantity > 1) {
          let index =
            this.$store.state.orders_pharmcy.pharmacy_requests.findIndex(
              (element) => {
                if (
                  element.id == item.id &&
                  element.quantity == item.quantity
                ) {
                  return element.id == item.id;
                }
              }
            );
          item.quantity -= 1;
          item.available_quantity += 1;
          this.$store.state.orders_pharmcy.total_price -= item.price;
          this.$store.state.orders_pharmcy.pharmacy_requests.splice(
            index,
            1,
            item
          );
        }
      },
    },
  };
</script>
