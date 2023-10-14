<template>
  <v-container>
    <v-row>
      <v-dialog :value="value" scrollable max-width="700px" dir="rtl">
        <v-card width="100%">
          <v-toolbar dark color="#177F83" class="d-flex justify-center">
            <v-toolbar-title align-center>تفاصيل الحجز</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-data-table
                class="mx-auto mt-10"
                :headers="headers_order"
                :items="view_details"
                hide-default-footer>
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center font-weight-black">
                      {{ item.booking.patint_name }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.booking.age }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.booking.doctor.name }}
                    </td>
                    <td class="text-center font-weight-black">
                      د.ع {{ item.value_paid | formatNumber }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.note }}
                    </td>

                    <td class="text-center font-weight-black">
                      {{ item.booking.address }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
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
      view_details: {
        type: Array,
        require: true,
      },
      value: Boolean,
    },
    data() {
      return {
        headers_order: [
          {
            text: "اسم الزبون",
            align: "center",
            value: "patint_name",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "العمر",
            align: "center",
            value: "gender",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "الدكتور",
            align: "center",
            value: "doctor",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "اخر دفعة",
            align: "center",
            value: "value_paid",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "ملاحظه",
            align: "center",
            value: "note",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "العنوان",
            align: "center",
            value: "address",
            class: "secondary white--text title",
            sortable: false,
          },
        ],
      };
    },
    methods: {},
  };
</script>
