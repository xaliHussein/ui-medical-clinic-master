<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="600px" persistent>
      <v-card class="mx-auto mt-3 card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل معلومات المندوب </v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_representative">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="representative_info.name = $event"
                  :value="representative_info.name"
                  type="text"
                  label="اسم المندوب"
                  :rules="nameRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="representative_info.phone_number = $event"
                  :value="representative_info.phone_number"
                  type="number"
                  label="رقم الهاتف"
                  :rules="phoneNumberRules" />
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Input
                  @update-value="representative_info.company_name = $event"
                  :value="representative_info.company_name"
                  type="text"
                  label="اسم الشركة"
                  :rules="RulseAll" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="edit_representative"
              :loading="loading"
              color="#159895"
              class="px-4 ml-3"
              elevation="4">
              <h4 style="color: white; font-size: 17px">تحديث</h4>
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
  export default {
    components: { Input },
    data() {
      return {
        nameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],

        phoneNumberRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length <= 11 ||
            "الحد الاعلى لارقام المسموحه هوه 11 رقم",
        ],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        representative_info: {},
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      representative: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.representatives.pop_loading;
      },
    },
    methods: {
      // تعديل المندوب
      edit_representative() {
        if (this.$refs.edit_representative.validate()) {
          let data = {};
          data["id"] = this.representative_info.id;
          data["name"] = this.representative_info.name;
          data["phone_number"] = this.representative_info.phone_number;
          data["company_name"] = this.representative_info.company_name;

          this.$store
            .dispatch("representatives/edit_representative", data)
            .then(() => {
              this.$emit("popClose");
            });
        }
      },
    },
    watch: {
      representative() {
        this.representative_info = this.representative;
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
