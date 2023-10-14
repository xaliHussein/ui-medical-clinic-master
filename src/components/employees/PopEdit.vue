<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="700px" persistent>
      <v-card class="mx-auto mt-3 card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل معلومات الموظف </v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_employee">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="employees_info.full_name = $event"
                  :value="employees_info.full_name"
                  type="text"
                  label="اسم الموظف"
                  :rules="fullNameRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="employees_info.phone_number = $event"
                  :value="employees_info.phone_number"
                  type="number"
                  label="رقم الهاتف"
                  :rules="phoneNumberRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="employees_info.employee_title = $event"
                  :value="employees_info.employee_title"
                  type="text"
                  label="اللقب الوظيفي"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="employees_info.salary = $event"
                  :value="employees_info.salary"
                  type="number"
                  label="الراتب"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <Input
                  @update-value="employees_info.address = $event"
                  :value="employees_info.address"
                  type="text"
                  label="العنوان"
                  :rules="RulseAll" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="edit_employee"
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
        phoneNumberRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length <= 11 ||
            "الحد الاعلى لارقام المسموحه هوه 11 رقم",
        ],
        fullNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        employees_info: {},
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      employees: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.employees.pop_loading;
      },
    },
    methods: {
      // تعديل الموظف
      edit_employee() {
        if (this.$refs.edit_employee.validate()) {
          let data = {};
          data["id"] = this.employees_info.id;
          data["full_name"] = this.employees_info.full_name;
          data["phone_number"] = this.employees_info.phone_number;
          data["employee_title"] = this.employees_info.employee_title;
          data["address"] = this.employees_info.address;
          data["salary"] = this.employees_info.salary;
          this.$store.dispatch("employees/edit_employee", data).then(() => {
            this.$emit("popClose");
          });
        }
      },
    },
    watch: {
      employees() {
        this.employees_info = this.employees;
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
