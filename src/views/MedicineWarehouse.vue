<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>اضافة ادوية</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_medicine">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="product_name = $event"
                    :value="product_name"
                    type="text"
                    label="اسم المنتج"
                    :rules="productNameRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="buy_price = $event"
                    :value="buy_price"
                    type="number"
                    label="سعر الشراء"
                    :rules="phoneNumberRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="price = $event"
                    :value="price"
                    type="number"
                    label="سعر البيع"
                    :rules="phoneNumberRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="quantity = $event"
                    :value="quantity"
                    type="text"
                    label="الكمية"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="company = $event"
                    :value="company"
                    type="text"
                    label="الشركة" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Textarea
                    @update-value="description = $event"
                    :value="description"
                    type="text"
                    label="الوصف"
                    :rules="notesRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Textarea
                    @update-value="note = $event"
                    :value="note"
                    type="text"
                    label="ملاحظات"
                    :rules="notesRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
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
                            $store.state.stores.representative_state ==
                            'finished'
                          )
                        "
                        class="text-lg-center"></div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <InputDate
                    @update-value="date = $event"
                    :value="date"
                    :rules="RulseAll"
                    label=" تاريخ انتهاء صلاحية" />
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
                  <h3 class="text-start mt-2 mr-2">اضف صور المنتج :</h3>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_medicine"
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
  import Table from "../components/stores/Table.vue";
  import Textarea from "../components/layout/Textarea.vue";
  import InputDate from "../components/layout/InputDate.vue";
  export default {
    components: { Input, InputDate, Textarea, Table },
    data() {
      return {
        representative_id: null,
        product_name: null,
        quantity: null,
        price: null,
        buy_price: null,
        note: null,
        company: null,
        description: null,
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        barcode: null,
        images: [],
        upload: [],

        productNameRules: [
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
        notesRules: [
          (v) =>
            (v || "").length <= 255 ||
            "لقد وصلت الحد الاقصى لعدد الحروف المطلوبة",
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
      this.$store.dispatch("stores/get_representatives");
    },

    computed: {
      representatives() {
        return this.$store.state.stores.representatives;
      },
      loading() {
        return this.$store.state.stores.loading_add_medicine;
      },
    },
    methods: {
      add_medicine() {
        if (this.$refs.add_medicine.validate()) {
          let data = {};
          data["product_name"] = this.product_name;
          data["quantity"] = this.quantity;
          data["price"] = this.price;
          data["buy_price"] = this.buy_price;
          data["expaired"] = this.date;
          data["note"] = this.note;
          data["company"] = this.company;
          data["description"] = this.description;
          if (this.representative_id != null) {
            data["representative_id"] = this.representative_id;
          }
          data["image"] = this.upload[0];
          this.$store.dispatch("stores/add_medicine", data).then(() => {
            this.$refs.add_medicine.reset();
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
