<template>
  <v-container>
    <v-row>
      <v-dialog :value="value" scrollable max-width="700px" dir="rtl">
        <v-card width="100%">
          <v-toolbar dark color="#177F83" class="d-flex justify-center">
            <v-toolbar-title align-center>الدفعات</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-data-table
                class="mx-auto mt-10"
                :headers="headers"
                :items="payments"
                :options.sync="pagination"
                :page.sync="pagination.page"
                :items-per-page="pagination.itemsPerPage"
                :loading="loading || false"
                hide-default-footer>
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center font-weight-black">
                      {{ item.representative.name }}
                    </td>

                    <td class="text-center font-weight-black">
                      د.ع {{ item.value | formatNumber }}
                    </td>

                    <td class="text-center font-weight-black">
                      {{ item.note }}
                    </td>

                    <td class="text-center font-weight-black">
                      {{ moment(item.created_at).format("YYYY-MM-DD hh:ss A") }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <div class="text-center py-5">
                <v-row>
                  <v-col cols="6" sm="6" md="6" lg="6">
                    <v-pagination
                      v-model="pagination.page"
                      :length="pageCount"
                      circle
                      color="#159895"></v-pagination>
                  </v-col>
                  <v-col cols="6" sm="6" md="6" lg="6">
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
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2 pb-5 mr-3">
            <v-btn outlined color="#C62828" v-on:click="$emit('popClose')">
              <h4>اغلاق</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    props: {
      value: Boolean,
    },
    data() {
      return {
        items: [1, 5, 10, 15, 20, 25],
        pagination: {},
        headers: [
          {
            text: "اسم المندوب",
            value: "name",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "دفعات",
            value: "value",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "ملاحظة",
            value: "note",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "التاريخ",
            value: "created_at",
            class: "secondary white--text title",
            align: "center",
          },
        ],
      };
    },
    computed: {
      pageCount() {
        return this.$store.state.representatives.pageCount2;
      },

      loading() {
        return this.$store.state.representatives.table_payments_loading;
      },
      params: {
        set(val) {
          this.$store.state.representatives.params_payments = val;
        },
        get() {
          return this.$store.state.representatives.params_payments;
        },
      },
      payments() {
        return this.$store.state.representatives.log_representative;
      },
    },
    methods: {
      get_logs() {
        let pagination = this.pagination;
        let par = {
          ...pagination,
        };
        this.params = par;

        this.$store.dispatch("representatives/get_logs");
      },
    },
    watch: {
      pagination: {
        handler() {
          this.get_logs();
        },
        deep: true,
      },
    },
  };
</script>
