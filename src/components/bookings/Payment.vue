<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="900px" persistent>
      <v-card class="mx-auto card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>دفع اقصاد</v-toolbar-title>
        </v-toolbar>
        <v-form ref="make_debt">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="value_paid = $event"
                  :value="value_paid"
                  type="number"
                  label="المبلغ"
                  :rules="RulseAll" />
              </v-col>

              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="note = $event"
                  :value="note"
                  type="text"
                  label="ملاحظات"
                  :rules="notesRules" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <h4>
              المبلغ المتبقي : د.ع
              {{ (value_remaining - value_paid) | formatNumber }}
            </h4>
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-data-table
                class="mx-auto mt-10"
                :headers="headers"
                :items="payments"
                hide-default-footer>
                <v-toolbar dark color="#177F83" class="d-flex justify-center">
                  <v-toolbar-title align-center
                    >الدفعات السابقة</v-toolbar-title
                  >
                </v-toolbar>
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center font-weight-black">
                      د.ع {{ item.value_paid | formatNumber }}
                    </td>
                    <td class="text-center font-weight-black">
                      د.ع {{ item.value_remaining | formatNumber }}
                    </td>

                    <td class="text-center font-weight-black">
                      د.ع
                      {{
                        (item.all_value_paid + item.value_paid) | formatNumber
                      }}
                    </td>
                    <td class="text-center font-weight-black" dir="ltr">
                      {{ moment(item.created_at).format("YYYY-MM-DD hh:ss A") }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.note }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="make_debt"
              :loading="pop_loading"
              :disabled="value_remaining - value_paid < 0"
              color="#159895"
              class="px-4 ml-3"
              elevation="4">
              <h4 style="color: white; font-size: 17px">دفع</h4>
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
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  import Input from "@/components/layout/Input.vue";
  import Textarea from "@/components/layout/Textarea.vue";

  export default {
    components: { Input, Textarea },
    data() {
      return {
        length_debts: null,
        debt_info: null,
        note: null,
        value_paid: null,
        value_remaining: null,
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        notesRules: [
          (v) =>
            (v || "").length <= 255 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
        ],
        headers: [
          {
            text: "المبلغ المدفوع",
            value: "value_paid",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "المبلغ المتبقي",
            value: "value_remaining",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "قيمة المدفوعات الكلية",
            value: "all_value_paid",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "تاريخ الدفعة",
            value: "payment_date",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "ملاحظة",
            value: "note",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      pop_loading() {
        return this.$store.state.debts.pop_loading;
      },
      pageCount() {
        return this.$store.state.bookings.pageCount3;
      },
      payments() {
        return this.$store.state.bookings.payments_user;
      },
    },
    methods: {
      // تعديل حجز
      make_debt() {
        if (this.$refs.make_debt.validate()) {
          let data = {};
          data["booking_id"] = this.payments[0].booking_id;
          data["value_paid"] = this.value_paid;
          data["note"] = this.note;
          this.$store.dispatch("debts/make_debt", data).then((res) => {
            // this.$store.state.bookings.payments_user.push(res.data.result[0]);
            this.$emit("popClose");
            this.$refs.make_debt.reset();
          });
        }
      },
    },
    watch: {
      payments() {
        this.value_remaining = this.payments[0].value_remaining;
        this.payments.forEach((e) => {
          if (e.value_remaining < this.value_remaining) {
            this.value_remaining = e.value_remaining;
          }
        });
      },
    },
  };
</script>
<style scoped>
  .card {
    border-radius: 25px !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
</style>
