<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>حجز جلسة</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_booking">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="patint_name = $event"
                    :value="patint_name"
                    type="text"
                    label="اسم الزبون"
                    :rules="patintNameRules" />
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
                    @update-value="gender = $event"
                    :value="gender"
                    itemValue="value"
                    itemText="type"
                    :items="gender_ty"
                    label="الجنس"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="age = $event"
                    :value="age"
                    type="number"
                    label="العمر"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="price = $event"
                    :value="price"
                    type="number"
                    label="السعر"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Selects
                    @update-value="booking_type = $event"
                    :value="booking_type"
                    itemValue="value"
                    itemText="type"
                    label="نوع الحجز"
                    :items="booking_ty"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Selects
                    @update-value="payment_method = $event"
                    :value="payment_method"
                    label="نوع الدفع"
                    itemValue="value"
                    itemText="type"
                    :items="payment_metd"
                    :rules="RulseAll" />
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-if="payment_method != null && payment_method.value == 1">
                  <Input
                    @update-value="value_paid = $event"
                    :value="value_paid"
                    type="number"
                    label="الدفعه الاولية"
                    :rules="valuePaidRulse" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="address = $event"
                    :value="address"
                    label="العنوان"
                    type="text"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4" v-if="user_type != 2">
                  <v-autocomplete
                    ref="bookingsDropdown"
                    :items="users"
                    v-model="doctor_id"
                    color="#159895"
                    hide-details="auto"
                    item-text="name"
                    item-value="id"
                    label="الاطباء"
                    :menu-props="menu_props"
                    outlined
                    rounded
                    clearable
                    lazy-rules
                    :rules="RulseAll"
                    class="font-weight-black">
                    <template v-slot:append-item>
                      <div
                        v-intersect="userInteract"
                        v-if="!($store.state.bookings.user_state == 'finished')"
                        class="text-lg-center"></div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Textarea
                    @update-value="primary_diagonses = $event"
                    :value="primary_diagonses"
                    type="text"
                    label="التشخيص الاولي"
                    :rules="notesRules" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Textarea
                    @update-value="booking_note = $event"
                    :value="booking_note"
                    type="text"
                    label="ملاحظات"
                    :rules="notesRules" />
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="4">
                  <InputDate
                    @update-value="booking_date = $event"
                    :value="booking_date"
                    :rules="RulseAll"
                    label="تاريخ الحجز" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <InputTime
                    @update-value="booking_time = $event"
                    :value="booking_time"
                    label="وقت الحجز"
                    :rules="RulseAll" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_booking"
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
  import Table from "../components/bookings/Table.vue";
  import Textarea from "../components/layout/Textarea.vue";
  import InputDate from "../components/layout/InputDate.vue";
  import InputTime from "../components/layout/InputTime.vue";
  import Selects from "../components/layout/Selects.vue";
  export default {
    components: {
      Input,
      InputDate,
      Textarea,
      Table,
      Selects,
      InputTime,
    },

    data() {
      return {
        patint_name: null,
        address: null,
        gender: null,
        phone_number: null,
        age: null,
        booking_time: null,
        doctor_id: null,
        booking_date: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        booking_type: null,
        booking_note: null,
        price: null,
        primary_diagonses: null,
        value_paid: null,
        payment_method: null,
        gender_ty: [
          { type: " ذكر", value: true },
          { type: " انثى", value: false },
        ],
        booking_ty: [
          { type: "العيادة", value: 0 },
          { type: "التواصل الاجتماعي", value: 1 },
          { type: "صديق", value: 2 },
        ],

        payment_metd: [
          { type: "نقد", value: 0 },
          { type: "آجل", value: 1 },
        ],

        patintNameRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length >= 3 || "الحد الادنى لعدد الاحرف هوه 3",
        ],

        valuePaidRulse: [
          (value) =>
            (!!value && this.payment_method.value == 1) || "هذا الحقل مطلوب",
        ],
        phoneNumberRules: [
          (value) => !!value || "هذا الحقل مطلوب",
          (value) =>
            (value || "").length <= 11 ||
            "الحد الاعلى لارقام المسموحه هوه 11 رقم",
        ],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        notesRules: [
          (v) => !!v || "هذا الحقل مطلوب",
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
      this.$store.dispatch("bookings/get_users");
    },

    computed: {
      bookings() {
        return this.$store.state.bookings.bookings;
      },
      users() {
        return this.$store.state.bookings.users;
      },
      user_type() {
        return this.$store.state.user_type;
      },
      loading() {
        return this.$store.state.bookings.loading_add_booking;
      },
    },
    methods: {
      add_booking() {
        if (this.$refs.add_booking.validate()) {
          let data = {};
          data["patint_name"] = this.patint_name;
          data["address"] = this.address;
          data["gender"] = this.gender.value;
          data["phone_number"] = this.phone_number;
          data["age"] = this.age;
          data["booking_time"] = this.booking_time;
          if (this.user_type != 2) {
            data["doctor_id"] = this.doctor_id;
          } else {
            data["doctor_id"] = localStorage.getItem("doctor_id");
          }

          data["booking_date"] = this.booking_date;
          data["booking_type"] = this.booking_type.value;
          data["booking_note"] = this.booking_note;
          data["price"] = this.price;
          data["primary_diagonses"] = this.primary_diagonses;
          data["value_paid"] = this.value_paid;
          data["payment_method"] = this.payment_method.value;
          this.$store.dispatch("bookings/add_booking", data).then(() => {
            this.$refs.add_booking.reset();
          });
        }
      },
      get_users() {
        if (this.$store.state.bookings.user_state == "finished") return;
        this.$store.dispatch("bookings/get_users");
      },
      userInteract(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_users(); // onscroll
            this.$refs.bookingsDropdown.onScroll();
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
