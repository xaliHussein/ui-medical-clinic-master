<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>اضافة مندوبين</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_representative">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="name = $event"
                    :value="name"
                    type="text"
                    label="اسم المندوب"
                    :rules="nameRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="phone_number = $event"
                    :value="phone_number"
                    type="number"
                    label="رقم الهاتف"
                    :rules="phoneNumberRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="company_name = $event"
                    :value="company_name"
                    type="text"
                    label="اسم الشركة"
                    :rules="RulseAll" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_representative"
                :loading="loading"
                color="#159895"
                large
                rounded
                class="px-16"
                elevation="4">
                <h4 style="color: white; font-size: 17px">اضافة</h4>
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon color="white">mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <Table />
  </v-container>
</template>
<script>
  import Input from "../components/layout/Input.vue";
  import Table from "../components/representatives/Table.vue";
  export default {
    components: { Input, Table },
    data() {
      return {
        name: null,
        phone_number: null,
        company_name: null,
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
      };
    },

    computed: {
      loading() {
        return this.$store.state.representatives.loading_add_representative;
      },
    },
    methods: {
      add_representative() {
        if (this.$refs.add_representative.validate()) {
          let data = {};
          data["name"] = this.name;
          data["phone_number"] = this.phone_number;
          data["company_name"] = this.company_name;
          this.$store
            .dispatch("representatives/add_representative", data)
            .then(() => {
              this.$refs.add_representative.reset();
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
  .card-table {
    box-shadow: 0px 0px 0px 0px !important;
    border-radius: 25px !important;
  }
</style>
