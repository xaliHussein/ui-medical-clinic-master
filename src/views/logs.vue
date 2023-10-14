<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="12" class="pb-8">
        <v-card class="mx-auto mt-3 card">
          <v-toolbar dark color="#177F83">
            <v-toolbar-title align-center>اضافة حركه مالية</v-toolbar-title>
          </v-toolbar>
          <v-form ref="add_log">
            <v-card-text class="mt-7">
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Selects
                    @update-value="log_type = $event"
                    :value="log_type"
                    label="نوع الفئة"
                    itemValue="value"
                    itemText="type"
                    :items="exchange_type"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Input
                    @update-value="value = $event"
                    :value="value"
                    type="number"
                    label="القيمة"
                    :rules="RulseAll" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="4">
                  <Textarea
                    @update-value="note = $event"
                    :value="note"
                    type="text"
                    label="ملاحظة"
                    :rules="notesRules" />
                </v-col>
                <!-- if log_type == 0  موظفين-->
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-if="log_type != null && log_type.value == 0">
                  <v-autocomplete
                    ref="employeeDropdown"
                    :items="employees"
                    v-model="employee_id"
                    color="#159895"
                    hide-details="auto"
                    item-text="full_name"
                    item-value="id"
                    label="الموظفين"
                    :menu-props="menu_props"
                    outlined
                    rounded
                    clearable
                    lazy-rules
                    :rules="RulseAll"
                    class="font-weight-black">
                    <template v-slot:append-item>
                      <div
                        v-intersect="userInteract_0"
                        v-if="!($store.state.logs.employee_state == 'finished')"
                        class="text-lg-center"></div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <!-- if log_type == 1 دكاترة -->
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-else-if="log_type != null && log_type.value == 1">
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
                        v-intersect="userInteract_1"
                        v-if="!($store.state.bookings.user_state == 'finished')"
                        class="text-lg-center"></div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <!-- if log type 2 مندوبين -->
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  lg="4"
                  v-else-if="log_type != null && log_type.value == 2">
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
                        v-intersect="userInteract_2"
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
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-2 pb-5">
              <v-btn
                @click="add_log"
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
  import Textarea from "../components/layout/Textarea.vue";
  import Selects from "../components/layout/Selects.vue";
  import Table from "../components/logs/Table.vue";
  export default {
    components: { Input, Textarea, Selects, Table },
    data() {
      return {
        log_type: null,
        representative_id: null,
        doctor_id: null,
        employee_id: null,
        note: null,
        value: null,
        exchange_type: [
          { type: "موظف", value: 0 },
          { type: "دكتور", value: 1 },
          { type: "مندوب", value: 2 },
          { type: "مصاريف", value: 3 },
        ],
        RulseAll: [(v) => !!v || "هذا الحقل مطلوب"],
        notesRules: [
          (v) =>
            (v || "").length <= 900 ||
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
    computed: {
      users() {
        return this.$store.state.bookings.users;
      },
      representatives() {
        return this.$store.state.stores.representatives;
      },
      employees() {
        return this.$store.state.logs.employees;
      },
      loading() {
        return this.$store.state.logs.loading_add_log;
      },
    },
    methods: {
      add_log() {
        if (this.$refs.add_log.validate()) {
          let data = {};
          data["log_type"] = this.log_type.value;
          if (this.log_type.value == 0) {
            data["target_id"] = this.employee_id;
            data["status"] = 0;
          } else if (this.log_type.value == 1) {
            data["target_id"] = this.doctor_id;
            data["status"] = 0;
          } else if (this.log_type.value == 2) {
            data["target_id"] = this.representative_id;
            data["status"] = 0;
          } else if (this.log_type.value == 3) {
            data["status"] = 0;
          }
          data["note"] = this.note;
          data["value"] = this.value;

          this.$store.dispatch("logs/add_log", data).then(() => {
            this.$refs.add_log.reset();
          });
        }
      },
      // موظفين
      get_employees() {
        if (this.$store.state.logs.employee_state == "finished") return;
        this.$store.dispatch("logs/get_employees");
      },
      userInteract_0(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_employees(); // onscroll
            if (this.log_type.value == 0) {
              this.$refs.employeeDropdown.onScroll();
            }
          }, 500);
        }
      },
      // مندوبين
      get_representatives() {
        if (this.$store.state.stores.representative_state == "finished") return;
        this.$store.dispatch("stores/get_representatives");
      },
      userInteract_2(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_representatives(); // onscroll
            if (this.log_type.value == 2) {
              this.$refs.representativeDropdown.onScroll();
            }
          }, 500);
        }
      },

      // دكاترة
      get_users() {
        if (this.$store.state.bookings.user_state == "finished") return;
        this.$store.dispatch("bookings/get_users");
      },
      userInteract_1(entries, observer, isIntersecting) {
        if (isIntersecting) {
          setTimeout(() => {
            this.get_users(); // onscroll
            if (this.log_type.value == 1) {
              this.$refs.bookingsDropdown.onScroll();
            }
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
