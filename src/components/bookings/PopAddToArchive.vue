<template>
  <v-row justify="center">
    <v-dialog :value="value" persistent max-width="700">
      <v-card class="card">
        <v-toolbar dark class="d-flex justify-center" color="#177F83">
          <v-toolbar-title align-center>ارشفة</v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_booking">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Textarea
                  @update-value="diagnosis = $event"
                  :value="diagnosis"
                  type="text"
                  label="تشخيص ثاني"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Textarea
                  @update-value="note = $event"
                  :value="note"
                  type="text"
                  label="ملاحظة"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <InputDate
                  @update-value="date = $event"
                  :value="date"
                  label="تاريخ الحجز" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions class="mt-2 pb-5 mr-3">
          <v-btn
            v-on:click="add_archive"
            :loading="loading"
            color="#159895"
            class="px-4"
            elevation="4">
            <h4 style="color: white; font-size: 17px">تاكيد</h4>
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
</template>
<script>
  import Textarea from "@/components/layout/Textarea.vue";
  import InputDate from "@/components/layout/InputDate.vue";
  export default {
    components: { Textarea, InputDate },
    data() {
      return {
        date: null,
        note: null,
        diagnosis: null,
        notesRules: [
          (v) =>
            (v || "").length <= 255 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
        ],
      };
    },
    props: {
      value: Boolean,
      data_archive: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.bookings.pop_loading;
      },
    },
    methods: {
      // تحويل معلومات الزبون الى الارشيف
      add_archive() {
        let data = {};
        data["booking_id"] = this.data_archive.id;
        data["another_time_booking"] = this.date;
        data["diagnosis"] = this.diagnosis;
        data["note"] = this.note;
        data["check"] = 1;
        this.$store.dispatch("bookings/add_archive", data).then(() => {
          this.$emit("popClose");
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
