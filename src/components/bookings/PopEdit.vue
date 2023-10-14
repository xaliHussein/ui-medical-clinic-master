<template>
  <v-row justify="center">
    <v-dialog :value="value" max-width="700px" persistent>
      <v-card class="mx-auto card" width="100%">
        <v-toolbar dark color="#177F83" class="d-flex justify-center">
          <v-toolbar-title align-center>تعديل معلومات المنتج </v-toolbar-title>
        </v-toolbar>
        <v-form ref="edit_booking">
          <v-card-text class="mt-7">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="bookings_info.patint_name = $event"
                  :value="bookings_info.patint_name"
                  type="text"
                  label="اسم الزبون"
                  :rules="patintNameRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="bookings_info.phone_number = $event"
                  :value="bookings_info.phone_number"
                  type="number"
                  label="رقم الهاتف"
                  :rules="phoneNumberRules" />
              </v-col>

              <v-col cols="12" sm="12" md="6" lg="6">
                <Selects
                  @update-value="gender = $event"
                  :value="gender"
                  itemValue="value"
                  itemText="type"
                  :items="gender_ty"
                  label="الجنس"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="bookings_info.age = $event"
                  :value="bookings_info.age"
                  type="number"
                  label="العمر"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="bookings_info.price = $event"
                  :value="bookings_info.price"
                  type="number"
                  label="السعر"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Selects
                  @update-value="booking_type = $event"
                  :value="booking_type"
                  itemValue="value"
                  itemText="type"
                  label="نوع الحجز"
                  :items="booking_ty"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
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
                sm="12"
                md="6"
                lg="6"
                v-if="payment_method != null && payment_method.value == 1">
                <Input
                  @update-value="bookings_info.value_paid = $event"
                  :value="bookings_info.value_paid"
                  type="number"
                  label="الدفعه الاولية"
                  :rules="valuePaidRulse" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Input
                  @update-value="bookings_info.address = $event"
                  :value="bookings_info.address"
                  label="العنوان"
                  type="text"
                  :rules="RulseAll" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-autocomplete
                  ref="bookingsDropdown"
                  :items="users"
                  v-model="doctor_id"
                  color="#159895"
                  hide-details="auto"
                  item-text="user_name"
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
                      v-if="!($store.state.users.user_state == 'finished')"
                      class="text-lg-center"></div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="bookings_info.primary_diagonses = $event"
                  :value="bookings_info.primary_diagonses"
                  type="text"
                  label="التشخيص الاولي"
                  :rules="notesRules" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <Textarea
                  @update-value="bookings_info.booking_note = $event"
                  :value="bookings_info.booking_note"
                  type="text"
                  label="ملاحظات"
                  :rules="notesRules" />
              </v-col>

              <v-col cols="12" sm="12" md="6" lg="6">
                <InputDate
                  @update-value="bookings_info.booking_date = $event"
                  :value="bookings_info.booking_date"
                  :rules="RulseAll"
                  label="تاريخ الحجز" />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <InputTime
                  @update-value="bookings_info.booking_time = $event"
                  :value="bookings_info.booking_time"
                  label="وقت الحجز"
                  :rules="RulseAll" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn
              @click="edit_booking"
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
  import InputTime from "@/components/layout/InputTime.vue";
  import Selects from "@/components/layout/Selects.vue";
  export default {
    components: { Input, Textarea, InputDate, InputTime, Selects },
    data() {
      return {
        bookings_info: null,
        booking_type: null,
        gender: null,
        payment_method: null,
        doctor_id: null,
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
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      bookings: {
        type: Object,
        default: null,
      },
    },
    computed: {
      loading() {
        return this.$store.state.bookings.pop_loading;
      },
      users() {
        return this.$store.state.bookings.users;
      },
    },
    methods: {
      // تعديل حجز
      edit_booking() {
        if (this.$refs.edit_booking.validate()) {
          let data = {};
          data["id"] = this.bookings_info.id;
          data["patint_name"] = this.bookings_info.patint_name;
          data["address"] = this.bookings_info.address;
          data["gender"] = this.gender.value;
          data["phone_number"] = this.bookings_info.phone_number;
          data["age"] = this.bookings_info.age;
          data["booking_time"] = this.bookings_info.booking_time;
          data["doctor_id"] = this.doctor_id;
          data["booking_date"] = this.bookings_info.booking_date;
          data["booking_type"] = this.booking_type.value;
          data["booking_note"] = this.bookings_info.booking_note;
          data["price"] = this.bookings_info.price;
          data["primary_diagonses"] = this.bookings_info.primary_diagonses;
          data["value_paid"] = this.bookings_info.value_paid;
          data["payment_method"] = this.payment_method.value;
          this.$store.dispatch("bookings/edit_booking", data).then(() => {
            this.$emit("popClose");
          });
        }
      },
      get_users() {
        if (this.$store.state.users.user_state == "finished") return;
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
    },
    watch: {
      bookings() {
        this.bookings_info = this.bookings;
        this.doctor_id = this.bookings.doctor_id;
        if (this.bookings_info.gender == 1) {
          this.gender = { type: " ذكر", value: true };
        } else {
          this.gender = { type: " انثى", value: false };
        }
        if (this.bookings_info.booking_type == 0) {
          this.booking_type = { type: "العيادة", value: 0 };
        } else if (this.bookings_info.booking_type == 1) {
          this.booking_type = { type: "التواصل الاجتماعي", value: 1 };
        } else {
          this.booking_type = { type: "صديق", value: 2 };
        }

        if (this.bookings_info.payment_method == 0) {
          this.payment_method = { type: "نقد", value: 0 };
        } else {
          this.payment_method = { type: "آجل", value: 1 };
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
</style>
