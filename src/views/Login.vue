<template>
  <v-container class="login" fluid>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-form ref="form">
          <v-card class="card" width="1200">
            <v-row class="justify-center">
              <v-col cols="12" sm="12" md="5" lg="5" class="justify-center">
                <v-card-title class="d-flex justify-center mt-6 mb-3">
                  <h2>تسجيل الدخول</h2>
                </v-card-title>
                <v-card-text class="mt-2">
                  <Input
                    @update-value="userName = $event"
                    :value="userName"
                    type="text"
                    label="اسم المستخدم"
                    :rules="userNameRules" />

                  <v-text-field
                    color="#159895"
                    v-model="password"
                    outlined
                    rounded
                    clearable
                    class="font-weight-black pt-5"
                    :type="showPassword ? 'text' : 'password'"
                    label="كلمة المرور"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :rules="PasswordsRules" />
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    @click="login"
                    :loading="loading_login"
                    color="#159895"
                    large
                    rounded
                    class="px-16 mx-auto"
                    elevation="4">
                    <h4 style="color: white; font-size: 17px">تسجيل الدخول</h4>
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon color="white">mdi-cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                </v-card-actions>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="7"
                lg="7"
                class="d-flex justify-center pa-0 ma-0">
                <v-img class="img" src="../assets/bg3.jpg" height="500">
                </v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import Input from "../components/layout/Input.vue";
  export default {
    components: { Input },
    data: () => ({
      items: ["مدير العيادة", "سكرتير", "دكتور", "مدير النظام"],
      userName: null,
      password: null,
      showPassword: false,
      userNameRules: [
        (value) => !!value || "هذا الحقل مطلوب",
        (value) => (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
      ],
      PasswordsRules: [
        (value) => !!value || "هذا الحقل مطلوب",
        (value) => (value || "").length >= 6 || "الحد الادنى لعدد الاحرف هوه 6",
      ],
    }),
    computed: {
      loading_login() {
        return this.$store.state.loading_login;
      },
    },
    methods: {
      login() {
        if (this.$refs.form.validate()) {
          let data = {};
          data["user_name"] = this.userName;
          data["password"] = this.password;
          this.$store.dispatch("login", data).then(() => {
            this.$router.push("/");
            // location.reload();
          });
        }
      },
    },
  };
</script>
<style scoped>
  .card {
    margin-top: 60px !important;
    margin: auto;
    border-radius: 15px;

    box-shadow: 0px 0px !important;
  }
  .login {
    /* opacity: 80%; */
    height: 100%;
  }
  .img {
    border-radius: 15px;
  }
  .card-img {
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8.7px);
    -webkit-backdrop-filter: blur(8.7px);
    /* border: 0.1px solid rgb(26, 95, 122); */
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
    margin-top: 100px;
  }
</style>
