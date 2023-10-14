<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="700px" persistent>
      <v-card class="mx-auto card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل معلومات الدواء </v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_medicine">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="medicine_info.medicen_name = $event"
                  :value="medicine_info.medicen_name"
                  type="text"
                  label="اسم المنتج"
                  :rules="productNameRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="medicine_info.price = $event"
                  :value="medicine_info.price"
                  type="number"
                  label="السعر"
                  :rules="phoneNumberRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="medicine_info.quantity = $event"
                  :value="medicine_info.quantity"
                  type="number"
                  label="الكمية"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="medicine_info.company = $event"
                  :value="medicine_info.company"
                  type="text"
                  label="الشركة" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="medicine_info.barCode = $event"
                  :value="medicine_info.barCode"
                  type="text"
                  label="الشركة"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="medicine_info.description = $event"
                  :value="medicine_info.description"
                  type="text"
                  label="الوصف"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="medicine_info.note = $event"
                  :value="medicine_info.note"
                  type="text"
                  label="ملاحظات"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="medicine_info.side_effect = $event"
                  :value="medicine_info.side_effect"
                  type="text"
                  label="الاعراض الجانبية"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-autocomplete
                  ref="representativeDropdown"
                  :items="representatives"
                  v-model="representative_id"
                  color="#159895"
                  hide-details="auto"
                  item-text="name"
                  item-value="id"
                  label="المندوبين"
                  :menu-props="menu_props"
                  outlined
                  rounded
                  clearable
                  lazy-rules
                  class="font-weight-black">
                  <template v-slot:append-item>
                    <div
                      v-intersect="userInteract"
                      v-if="
                        !(
                          $store.state.stores.representative_state == 'finished'
                        )
                      "
                      class="text-lg-center"></div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <InputDate
                  @update-value="medicine_info.expaired = $event"
                  :value="medicine_info.expaired"
                  :rules="RulseAll"
                  label=" تاريخ انتهاء صلاحية" />
              </v-col>
              <v-col cols="12" sm="4">
                <div
                  class="d-flex justify-start mr-2"
                  style="display: flex; justify-content: center">
                  <VueUploadMultipleImage
                    :idUpload="'image-upload-store' + medicine_info.id"
                    :idEdit="'image-edit-store' + medicine_info.id"
                    @upload-success="uploadImageSuccess"
                    @before-remove="beforeRemove"
                    @edit-image="editImage"
                    :data-images="images"
                    dragText="اضف صور"
                    primaryText="تم الاضافة بنجاح"
                    browseText=""
                    maxImageSize="5" />
                </div>
                <h3 class="text-start mt-2 mr-2">اضف صور المنتج :</h3>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="edit_medicine"
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
  import Textarea from "@/components/layout/Textarea.vue";
  import InputDate from "@/components/layout/InputDate.vue";
  export default {
    components: { Input, Textarea, InputDate },
    data() {
      return {
        representative_id: null,
        upload: [],
        images: [],
        productNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],

        phoneNumberRules: [(value) => !!value || "هذا الحقل مطلوب"],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        notesRules: [
          (v) =>
            (v || "").length <= 255 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
        ],
        medicine_info: {},
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
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      medicine: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.pharmacies.pop_loading;
      },
      representatives() {
        return this.$store.state.stores.representatives;
      },
    },
    methods: {
      // تعديل المنتج
      edit_medicine() {
        if (this.$refs.edit_medicine.validate()) {
          let data = {};
          data["id"] = this.medicine_info.id;
          data["medicen_name"] = this.medicine_info.medicen_name;
          data["barCode"] = this.medicine_info.barCode;
          data["quantity"] = this.medicine_info.quantity;
          data["price"] = this.medicine_info.price;
          data["expaired"] = this.medicine_info.expaired;
          data["note"] = this.medicine_info.note;
          data["company"] = this.medicine_info.company;
          data["description"] = this.medicine_info.description;
          data["side_effect"] = this.medicine_info.side_effect;
          data["representative_id"] = this.representative_id;

          if (this.upload.length > 0) {
            data["image"] = this.upload[0];
          }
          this.$store.dispatch("pharmacies/edit_medicine", data).then(() => {
            this.$emit("popClose");
            this.images = [];
            this.upload = [];
          });
        }
      },
      get_representatives() {
        if (this.$store.state.stores.representative_state == "finished") return;
        this.$store.dispatch("stores/get_representatives");
      },
      userInteract(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_representatives(); // onscroll
            this.$refs.representativeDropdown.onScroll();
          }, 500);
        }
      },
      uploadImageSuccess(formData, index, fileList) {
        this.upload = [];
        fileList.forEach((element) => {
          let img = element.path;
          this.upload.push(img);
        });
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
      medicine() {
        this.medicine_info = this.medicine;
        this.representative_id = this.medicine.representative_id;
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
