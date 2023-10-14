<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>اضافة عيادة</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_medical_clinic">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="clinic_name = $event"
                    :value="clinic_name"
                    type="text"
                    label="اسم العيادة"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="whats_app = $event"
                    :value="whats_app"
                    type="text"
                    label="whats app" />
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
                    @update-value="address = $event"
                    :value="address"
                    type="text"
                    label="عنوان العيادة"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="4">
                  <div
                    class="d-flex justify-start mr-2"
                    style="display: flex; justify-content: center">
                    <VueUploadMultipleImage
                      idUpload="image-upload-store"
                      idEdit="image-edit-store"
                      @upload-success="uploadImageSuccess"
                      @before-remove="beforeRemove"
                      @edit-image="editImage"
                      :data-images="images"
                      dragText="اضف صور"
                      primaryText="تم الاضافة بنجاح"
                      browseText=""
                      maxImageSize="5" />
                  </div>
                  <h3 class="text-start mt-2 mr-2">اضف صورة لعيادة :</h3>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_medical_clinic"
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
  import Table from "../components/medical_clinic/Table.vue";
  export default {
    components: { Input, Table },
    data() {
      return {
        clinic_name: "",
        phone_number: "",
        address: "",
        images: [],
        upload: [],
        whats_app: null,
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
        return this.$store.state.clinics.loading_add_clinic;
      },
    },
    methods: {
      add_medical_clinic() {
        if (this.$refs.add_medical_clinic.validate()) {
          let data = {};
          data["clinic_name"] = this.clinic_name;
          data["phone_number"] = this.phone_number;
          data["address"] = this.address;
          // data["WhatsApp"] = this.whats_app;
          if (this.upload.length > 0) {
            data["logo"] = this.upload[0];
          }
          this.$store.dispatch("clinics/add_medical_clinic", data).then(() => {
            this.upload = [];
            this.images = [];
            this.$refs.add_medical_clinic.reset();
          });
        }
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });
        console.log(fileList);
      },
      beforeRemove(index, done, fileList) {
        var r = confirm("سوف يتم حذف الصورة");
        if (r == true) {
          done();
          this.upload.splice(index, 1);
        }
      },
      editImage(formData, index, fileList) {
        console.log("edit data", formData, index, fileList);
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
<style lang="scss">
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr
    > th {
    background-color: #177f83 !important;
    color: #ffffff !important;
    font-family: "Cairo", sans-serif !important;
  }
  // .theme--light.v-data-table > .v-data-table__wrapper {
  //   border-radius: 14px !important;
  // }
</style>
