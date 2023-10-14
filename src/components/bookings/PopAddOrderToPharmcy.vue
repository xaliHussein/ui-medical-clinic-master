<template>
  <v-container>
    <v-row>
      <v-dialog :value="dialog" scrollable max-width="900px" dir="rtl">
        <v-card width="100%">
          <v-toolbar dark color="#177F83" class="d-flex justify-center">
            <v-toolbar-title align-center>انشاء وصفة</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form_add_details">
            <v-card-title>
              <v-row>
                <v-col cols="12" sm="6" md="5" lg="5" class="ma-0">
                  <Textarea
                    v-model="key"
                    @update-value="key = $event"
                    :value="key"
                    type="text"
                    :rules="notesRules"
                    label="اسم العلاج " />
                </v-col>
                <v-col cols="12" sm="6" md="5" lg="5" class="ma-0">
                  <Textarea
                    @update-value="value = $event"
                    :value="value"
                    type="text"
                    :rules="notesRules"
                    label="وقت العلاج"></Textarea
                ></v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    @click="add_details"
                    color="#159895"
                    large
                    rounded
                    class="px-16"
                    elevation="4">
                    <h4 style="color: white; font-size: 17px">اضافة</h4>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </v-form>
          <v-card-text style="height: 300px; width: 900px" class="mt-3 mx-auto">
            <template>
              <v-simple-table class="">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">اسم العلاج</th>
                      <th class="text-center">وقت العلاج</th>
                      <th class="text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, index) in advance_details" :key="index">
                      <td
                        class="text-center font-weight-black"
                        v-for="(objKey, indexkey) in Object.keys(data)"
                        :key="indexkey + 'B'">
                        {{ objKey }}
                      </td>
                      <td
                        class="text-center font-weight-black"
                        v-for="(objKey, indexkey) in Object.keys(data)"
                        :key="indexkey + 'C'">
                        {{ data[objKey] }}
                      </td>
                      <td class="text-center font-weight-black">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              @click="delete_detail(index)"
                              fab
                              icon
                              x-small
                              v-bind="attrs"
                              v-on="on">
                              <Icon
                                icon="material-symbols:delete"
                                color="#C62828"
                                width="32" />
                            </v-btn>
                          </template>
                          <span>حذف القسم</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="addOrder"
              :loading="loading"
              color="#159895"
              class="px-4"
              elevation="4">
              <h4 style="color: white; font-size: 17px">طباعة</h4>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon color="white">mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  import Textarea from "@/components/layout/Textarea.vue";
  import autoTable from "jspdf-autotable";
  import moment from "moment";
  import { jsPDF } from "jspdf";
  export default {
    components: { Textarea },
    props: {
      bookings: {
        type: Object,
        require: true,
      },
      dialog: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        object: {},
        print_data: [],
        advance_details: [],
        input_advance_details: {},
        key: "",
        value: "",

        notesRules: [
          (v) => !!v || "هذا الحقل مطلوب",
          (v) =>
            (v || "").length <= 400 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
        ],
      };
    },

    computed: {
      loading() {
        return this.$store.state.bookings.pop_loading;
      },
      clinic_name() {
        return this.$store.state.clinic_name;
      },
      image_clinic() {
        return this.$store.state.image_clinic;
      },
    },
    methods: {
      addOrder() {
        if (this.advance_details.length > 0) {
          let data = {};
          data["booking_id"] = this.bookings.id;
          data["medicens"] = this.advance_details;
          //   ارشفة معلومات الزبون
          this.$store.dispatch("bookings/add_archive", data);
          //   طباعة وصفة وتحويلها الى صيدلية
          this.$store
            .dispatch("bookings/add_order_to_pharmcy", data)
            .then(() => {
              this.exportToPDF(
                this.bookings,
                this.advance_details,
                this.clinic_name
              );
              this.$emit("popClose");
            });
        }
      },
      add_details() {
        if (this.$refs.form_add_details.validate()) {
          let data = {};
          data[this.key] = this.value;
          Object.assign(this.input_advance_details, data);
          this.saveAdvance_details();
          this.$refs.form_add_details.reset();
        }
      },
      delete_detail(index) {
        this.advance_details.splice(index, 1);
        console.log("advance_details", this.advance_details);
      },
      saveAdvance_details() {
        this.advance_details.push(this.input_advance_details);
        this.input_advance_details = {};
      },
      exportToPDF(bookings, advance_details, clinic_name) {
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
        advance_details.forEach((data) => {
          Object.keys(data).forEach((objKey) => {
            this.object = {};
            this.object["medicine"] = objKey;
            this.object["time"] = data[objKey];
          });
          this.print_data.push(this.object);
        });
        var body = [
          ["رقم الطلب", "التاريخ ", "اسم الدكتور"],
          [
            bookings.booking_code,
            moment().format("YYYY-MM-DD hh:mm A"),
            bookings.doctor.user_name,
          ],
        ];
        autoTable(pdf, {
          body: body,
          bodyStyles: { halign: "center" },
          margin: { top: 160 },
          styles: { font: "Amiri-Regular-normal" },
        });
        autoTable(pdf, {
          body: this.print_data,
          columns: [
            { header: "وقت العلاج", dataKey: "time" },
            { header: "اسم العلاج", dataKey: "medicine" },
          ],
          headStyles: { fillColor: [23, 127, 131], halign: "center" },
          bodyStyles: { halign: "center" },
          margin: { top: 173 },
          theme: "grid",
          styles: { font: "Amiri-Regular-normal" },
        });
        pdf.save(bookings.booking_code + ".pdf");
        this.advance_details = [];
        this.object = {};
        this.print_data = [];
      },
    },
  };
</script>
