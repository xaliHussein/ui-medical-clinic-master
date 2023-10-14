<template>
  <v-row justify="center">
    <v-dialog :value="value" persistent max-width="600px">
      <v-card class="card">
        <v-toolbar dark class="d-flex justify-center" color="#177F83">
          <v-toolbar-title align-center>ارسال رسالة على واتسب</v-toolbar-title>
        </v-toolbar>
        <v-form ref="send_message">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Textarea
                  @update-value="message = $event"
                  :value="message"
                  type="text"
                  label="اكتب رسالة ..."
                  :rules="notesRules" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions class="mt-2 pb-5 mr-3">
          <v-btn
            v-on:click="send_message"
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
  export default {
    components: { Textarea },
    data() {
      return {
        message: null,
        notesRules: [
          (v) => !!v || "هذا الحقل مطلوب",
          (v) =>
            (v || "").length <= 255 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
        ],
      };
    },
    props: {
      value: Boolean,
      customer: {
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
      send_message() {
        if (this.$refs.send_message.validate()) {
          let data = {};
          data["phone_number_recipient"] = this.customer.phone_number;
          data["message"] = this.message;
          this.$store.dispatch("bookings/send_message", data).then(() => {
            this.$emit("popClose");
            this.message = null;
          });
        }
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
