<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="700px" persistent>
      <v-card class="mx-auto mt-3 card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل العيادة </v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_medical_clinic">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="clinic_info.clinic_name = $event"
                  :value="clinic_info.clinic_name"
                  type="text"
                  label="اسم العيادة"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <Input
                  @update-value="whats_app = $event"
                  :value="whats_app"
                  type="text"
                  label="whats app" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="clinic_info.phone_number = $event"
                  :value="clinic_info.phone_number"
                  type="number"
                  label="رقم الهاتف"
                  :rules="phoneNumberRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="clinic_info.address = $event"
                  :value="clinic_info.address"
                  type="text"
                  label="عنوان العيادة"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12">
                <div
                  class="d-flex justify-start mr-2"
                  style="display: flex; justify-content: center">
                  <VueUploadMultipleImage
                    :idUpload="'image-upload-store' + clinic_info.id"
                    :idEdit="'image-edit-store' + clinic_info.id"
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
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="edit_medical_clinic"
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
        clinic_info: {},
        rules: [(v) => !!v || "هذا الحقل مطلوب"],
      };
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      clinic: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.clinics.pop_loading;
      },
    },
    methods: {
      // تعديل المستخدم
      edit_medical_clinic() {
        if (this.$refs.edit_medical_clinic.validate()) {
          let data = {};
          data["id"] = this.clinic_info.id;
          data["clinic_name"] = this.clinic_info.clinic_name;
          data["phone_number"] = this.clinic_info.phone_number;
          data["address"] = this.clinic_info.address;
          // data["WhatsApp"] = this.whats_app;
          if (this.upload.length > 0) {
            data["logo"] = this.upload[0];
          }

          this.$store.dispatch("clinics/edit_medical_clinic", data).then(() => {
            this.upload = [];
            this.images = [];
            this.$emit("popClose");
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
    watch: {
      clinic() {
        this.clinic_info = this.clinic;
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
