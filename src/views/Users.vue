<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>اضافة مستخدمين</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_user">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="name = $event"
                    :value="name"
                    type="text"
                    label="الاسم"
                    :rules="userNameRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="user_name = $event"
                    :value="user_name"
                    type="text"
                    label="اسم المستخدم"
                    :rules="userNameRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-text-field
                    color="#159895"
                    v-model="password"
                    outlined
                    rounded
                    hide-details="auto"
                    clearable
                    class="font-weight-black"
                    :type="showPassword ? 'text' : 'password'"
                    label="كلمة المرور"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :rules="PasswordsRules" />
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
                  <Selects
                    @update-value="user_type = $event"
                    :value="user_type"
                    itemValue="value"
                    itemText="account_type"
                    :items="filteredItems"
                    label="نوع الحساب"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <v-autocomplete
                    v-if="type_user == 0"
                    ref="clinicDropdown"
                    :items="medical_clinic"
                    v-model="id"
                    color="#159895"
                    hide-details="auto"
                    item-text="clinic_name"
                    item-value="id"
                    label="العيادة"
                    :menu-props="menu_props"
                    outlined
                    rounded
                    clearable
                    lazy-rules
                    class="font-weight-black">
                    <template v-slot:append-item>
                      <div
                        v-intersect="userInteract"
                        v-if="!($store.state.users.clinic_state == 'finished')"
                        class="text-lg-center"></div>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_user"
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
  import Selects from "../components/layout/Selects";
  import Table from "../components/users/Table.vue";
  export default {
    components: { Input, Selects, Table },
    data() {
      return {
        id: null,
        name: null,
        user_name: null,
        password: null,
        phone_number: null,
        user_type: null,
        showPassword: false,
        userNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],
        PasswordsRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
        ],
        phoneNumberRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length <= 11 ||
            "الحد الاعلى لارقام المسموحه هوه 11 رقم",
        ],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        user_ty: [
          { account_type: "مدير عيادة", value: 1, type: 0 },
          { account_type: "دكتور", value: 2, type: 1, type2: 0 },
          { account_type: "سكرتير", value: 3, type: 1, type2: 0 },
          { account_type: "صيدلي", value: 4, type: 1, type2: 0 },
        ],

        menu_props: {
          closeOnClick: false,
          closeOnContentClick: false,
          disableKeys: true,
          openOnClick: false,
          maxHeight: 300,
          offsetY: true,
          offsetOverflow: true,
          transition: false,
        },
      };
    },
    mounted() {
      if (this.$store.state.user_type == 0) {
        this.$store.dispatch("users/get_clinics");
      }
    },
    computed: {
      medical_clinic() {
        return this.$store.state.users.medical_clinic;
      },
      loading() {
        return this.$store.state.users.loading_add_user;
      },
      type_user() {
        return this.$store.state.user_type;
      },
      clinic_id() {
        return this.$store.state.clinic_id;
      },
      filteredItems() {
        return this.user_ty.filter(
          (opation) =>
            opation.type == this.type_user || opation.type2 == this.type_user
        );
      },
    },
    methods: {
      add_user() {
        if (this.$refs.add_user.validate()) {
          let data = {};
          data["name"] = this.name;
          data["user_name"] = this.user_name;
          data["phone_number"] = this.phone_number;
          data["password"] = this.password;
          data["user_type"] = this.user_type.value;
          if (this.type_user == 1) {
            data["clinic_id"] = this.clinic_id;
          } else {
            data["clinic_id"] = this.id;
          }

          this.$store.dispatch("users/add_user", data).then(() => {
            this.$refs.add_user.reset();
          });
        }
      },
      get_clinics() {
        if (this.$store.state.users.clinic_state == "finished") return;
        this.$store.dispatch("users/get_clinics");
      },
      userInteract(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_clinics(); // onscroll
            this.$refs.clinicDropdown.onScroll();
          }, 500);
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
