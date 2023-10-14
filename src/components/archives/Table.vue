<template>
  <v-card class="mx-auto mt-9 card-table" width="100%">
    <v-row class="d-flex justify-center mb-9">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-data-table
          :headers="filteredItems"
          :items="archives"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :loading="loading || false"
          hide-default-footer
          loading-text="جاري التحميل يرجى الأنتظار"
          height="400">
          <template v-slot:top>
            <v-toolbar flat class="mt-2">
              <v-toolbar-title>جدول الارشيف</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="reset_table"
                    fab
                    icon
                    x-small
                    v-bind="attrs"
                    v-on="on">
                    <Icon
                      icon="solar:smartphone-update-bold"
                      color="#159895"
                      width="30" />
                  </v-btn>
                </template>
                <span>تحديث معلومات الجدول</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="archive_query"
                @input="query_change"
                append-icon="mdi-magnify"
                label="بحث"
                class="font-weight-black"
                color="#159895"
                outlined
                rounded
                clearable
                hide-details />
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center font-weight-black">
                {{ item.booking.booking_code }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.patint_name }}
              </td>
              <td class="text-center font-weight-black" v-if="user_type != 2">
                {{ item.booking.doctor.name }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.phone_number }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.address }}
              </td>
              <td class="text-center font-weight-black">
                {{ item.booking.primary_diagonses }}
              </td>

              <td
                class="text-center font-weight-black"
                v-if="item.another_time_booking != null">
                {{ item.another_time_booking }}
              </td>
              <td class="text-center font-weight-black" v-else>لايوجد</td>
              <td class="text-center font-weight-black">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="popViewDetails(item)"
                      fab
                      icon
                      x-small
                      v-bind="attrs"
                      v-on="on">
                      <Icon
                        icon="material-symbols:display-settings-rounded"
                        color="#004D40"
                        width="32" />
                    </v-btn>
                  </template>
                  <span>معلومات الزبون</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div class="text-center py-5">
          <v-row>
            <v-col cols="5" sm="5" md="3" lg="3">
              <v-pagination
                v-model="pagination.page"
                :length="pageCount"
                circle
                color="#159895"></v-pagination>
            </v-col>
            <v-col cols="5" sm="5" md="3" lg="3">
              <v-select
                v-model="pagination.itemsPerPage"
                :items="items"
                color="#159895"
                outlined
                rounded
                single-line
                hide-details
                reverse
                label="عدد العناصر"></v-select>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </div>
        <PopViewDetails
          :value="pop_view"
          v-on:popClose="popClose()"
          :archives="data_view" />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
  import PopViewDetails from "@/components/archives/PopViewDetails";
  export default {
    components: { PopViewDetails },
    data() {
      return {
        pop_view: false,
        data_view: [],
        pop_delete: false,
        data_deleted: null,
        pop_edit: false,
        data_editor: null,
        items: [1, 5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "رقم الارشيف",
            value: "booking_code",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "اسم الزبون",
            value: "patint_name",
            class: "secondary white--text title",
            align: "center",
          },
          {
            text: "الدكتور",
            value: "patint_name",
            class: "secondary white--text title",
            align: "center",
            type: 2,
          },
          {
            text: "رقم الهاتف",
            value: "phone_number",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },

          {
            text: "العنوان",
            value: "address",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "التشخيص الاولي",
            value: "primary_diagonses",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },

          {
            text: "حجز اخر",
            value: "another_time_booking",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "العمليات",
            value: "booking_note",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
        adverstments: [],
      };
    },
    computed: {
      filteredItems() {
        return this.headers.filter((opation) => opation.type != this.user_type);
      },
      archive_query: {
        set(val) {
          this.$store.state.archives.archive_query = val;
        },
        get() {
          return this.$store.state.archives.archive_query;
        },
      },
      pageCount() {
        return this.$store.state.archives.pageCount;
      },

      archives() {
        return this.$store.state.archives.archives;
      },
      loading() {
        return this.$store.state.archives.table_loading;
      },
      user_type() {
        return this.$store.state.user_type;
      },
      doctor_id() {
        return this.$store.state.doctor_id;
      },
      params: {
        set(val) {
          this.$store.state.archives.params = val;
        },
        get() {
          return this.$store.state.archives.params;
        },
      },
    },
    methods: {
      // جلب الموظفين
      get_archives() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;
        if (this.user_type == 2) {
          this.$store.state.archives.doctor_id = this.doctor_id;
        }
        this.$store.dispatch("archives/get_archives");
      },
      query_change() {
        clearTimeout(this._timerId);
        this._timerId = setTimeout(() => {
          this.get_archives();
          this.pagination.page = 1;
        }, 1000);
      },
      // عرض تفاصيل الزبون
      popViewDetails(item) {
        this.data_view.push(item);
        this.pop_view = true;
      },

      popDelete(item) {
        this.data_deleted = item;
        this.pop_delete = true;
      },
      popEdit(item) {
        this.data_editor = item;
        console.log("data_editor", this.data_editor);
        this.pop_edit = true;
      },
      popClose() {
        this.pop_view = false;
        this.data_view = [];
      },

      // حذف الموظف
      deleteEmployee() {
        let data = {};
        data["id"] = this.data_deleted;
        this.$store.dispatch("archives/delete_employee", data).then(() => {
          this.pop_delete = false;
          this.data_deleted = null;
        });
      },
      reset_table() {
        this.$store.dispatch("archives/reset_table");
        this.get_archives();
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_archives();
        },
        deep: true,
      },
    },
  };
</script>
