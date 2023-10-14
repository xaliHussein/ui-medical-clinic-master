<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="headers"
          :items="salaries"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الحركات المالية</v-toolbar-title>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mt-1"
                    :loading="loading_print"
                    :disabled="loading"
                    @click="exportToPDF(clinic_name)"
                    fab
                    icon
                    x-small
                    v-bind="attrs"
                    v-on="on">
                    <Icon icon="fluent:print-28-filled" width="30" />
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon color="white">mdi-cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </template>
                <span>طباعة</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="log_query"
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
              <!-- اسم الموظف -->
              <td
                class="text-center font-weight-black"
                v-if="item.log_type == 0 && item.employees != null">
                {{ item.employees.full_name }}
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.log_type == 1 && item.users != null">
                {{ item.users.name }}
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.log_type == 2 && item.representative != null">
                {{ item.representative.name }}
              </td>
              <td class="text-center font-weight-black" v-else>لايوجد</td>

              <!-- نوع الصرف -->
              <td
                class="text-center font-weight-black"
                v-if="item.log_type == 0">
                راتب موظف
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.log_type == 1">
                راتب دكتور
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.log_type == 2">
                راتب مندوب
              </td>
              <td
                class="text-center font-weight-black"
                v-else-if="item.log_type == 3">
                مصاريف
              </td>
              <td class="text-center font-weight-black" v-else>حجوزات</td>
              <td class="text-center font-weight-black" v-if="item.status == 0">
                <h4 style="color: #ff9800">سحب</h4>
              </td>
              <td class="text-center font-weight-black" v-else>
                <h4 style="color: green">ايداع</h4>
              </td>
              <td class="text-center font-weight-black">
                د.ع {{ item.value | formatNumber }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.note }}
              </td>
              <td class="text-center font-weight-black" dir="ltr">
                {{ moment(item.created_at).format("YYYY-MM-DD hh:ss A") }}
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
            <v-col cols="5" sm="5" md="2" lg="2">
              <Selects
                @update-value="status = $event"
                :value="status"
                label="الدفع"
                itemValue="value"
                itemText="type"
                :items="status_type" />
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
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import InputDate from "@/components/layout/InputDate.vue";
  import Selects from "@/components/layout/Selects.vue";
  import autoTable from "jspdf-autotable";
  import moment from "moment";
  import { jsPDF } from "jspdf";
  export default {
    components: { InputDate, Selects },
    data() {
      return {
        date_from: "",
        date_to: "",
        status: null,
        print_data: [],
        loading_print: false,
        status_type: [
          { type: "سحب", name: "status", value: 0 },
          { type: "ايداع", name: "status", value: 1 },
        ],
        items: [5, 10, 15, 20, 25, 50, 100],
        pagination: {},
        headers: [
          {
            text: "اسم الموظف",
            value: "name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "نوع العملية",
            value: "log_type",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "حالة",
            value: "status",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "القيمة",
            value: "value",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "ملاحظة",
            value: "note",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "تاريخ",
            value: "created_at",
            class: "secondary white--text title",
            align: "center",
          },
        ],
      };
    },
    computed: {
      log_query: {
        set(val) {
          this.$store.state.logs.log_query = val;
        },
        get() {
          return this.$store.state.logs.log_query;
        },
      },
      pageCount() {
        return this.$store.state.logs.pageCount;
      },

      salaries() {
        return this.$store.state.logs.logs;
      },
      clinic_name() {
        return this.$store.state.clinic_name;
      },
      image_clinic() {
        return this.$store.state.image_clinic;
      },
      loading() {
        return this.$store.state.logs.table_loading;
      },
      params: {
        set(val) {
          this.$store.state.logs.params = val;
        },
        get() {
          return this.$store.state.logs.params;
        },
      },
    },
    methods: {
      // جلب مواد الصيدلية
      get_logs() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        this.$store.dispatch("logs/get_logs");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_logs();
          this.pagination.page = 1;
        }, 1000);
      },

      reset_table() {
        this.$store.dispatch("logs/reset_table").then(() => {
          this.date_to = null;
          this.date_from = null;
        });
        this.get_logs();
      },
      exportToPDF(clinic_name) {
        this.loading_print = true;
        let data = {};
        data["id"] = localStorage.getItem("clinic_id");
        this.$store.dispatch("clinics/get_image_clinic", data).then(() => {
          const pdf = new jsPDF("p", "pt", "A4");
          var font = this.$store.state.font.font; // let data = {};
          pdf.addFileToVFS("Amiri-Regular-normal.ttf", font);
          pdf.addFont(
            "Amiri-Regular-normal.ttf",
            "Amiri-Regular-normal",
            "normal"
          );
          pdf.setFont("Amiri-Regular-normal");
          pdf.addImage(this.image_clinic, 250, 40, 70, 70);
          pdf.text(262, 135, clinic_name);
          // احضار الطلب و وضع تفاصيله في مصفوفه وعرضه في جدول
          this.salaries.forEach((data) => {
            this.object = {};
            if (data.log_type == 0) {
              this.object["name"] = data.employees.full_name;
              this.object["type_log"] = "راتب موظف";
            } else if (data.log_type == 1) {
              this.object["name"] = data.users.name;
              this.object["type_log"] = "راتب دكتور";
            } else if (data.log_type == 2) {
              this.object["name"] = data.representative.name;
              this.object["type_log"] = " راتب مندوب";
            } else if (data.log_type == 3) {
              this.object["name"] = "لايوجد";
              this.object["type_log"] = "مصاريف";
            } else {
              this.object["name"] = "لايوجد";
              this.object["type_log"] = "حجوزات";
            }
            if (data.status == 0) {
              this.object["status"] = "سحب";
            } else {
              this.object["status"] = "ايداع";
            }

            this.object["value"] = data.value;
            this.object["note"] = data.note;
            this.object["created_at"] = moment(data.created_at).format(
              "YYYY-MM-DD hh:ss A"
            );

            this.print_data.push(this.object);
          });
          autoTable(pdf, {
            body: this.print_data,
            columns: [
              { header: "تاريخ", dataKey: "created_at" },
              { header: "ملاحظة", dataKey: "note" },
              { header: "القيمة", dataKey: "value" },
              { header: "الحالة", dataKey: "status" },
              { header: "نوع العملية", dataKey: "type_log" },
              { header: "اسم الموظف", dataKey: "name" },
            ],
            headStyles: { fillColor: [23, 127, 131], halign: "center" },
            bodyStyles: { halign: "center" },
            margin: { top: 173 },
            theme: "grid",
            styles: { font: "Amiri-Regular-normal" },
          });
          pdf.save(
            clinic_name + moment().format("YYYY-MM-DD hh:ss A") + ".pdf"
          );
          this.print_data = [];
          this.loading_print = false;
        });
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_logs();
        },
        deep: true,
      },
      status: {
        handler() {
          this.$store.state.logs.status = this.status;
          this.get_logs();
        },
      },
      date_from: {
        handler() {
          this.$store.state.logs.date_from = this.date_from;
          this.get_logs();
        },
      },
      date_to: {
        handler() {
          this.$store.state.logs.date_to = this.date_to;
          this.get_logs();
        },
      },
    },
  };
</script>
