<template>
  <v-container>
    <v-row>
      <v-dialog :value="value" scrollable max-width="900px" dir="rtl">
        <v-card width="100%">
          <v-toolbar dark color="#177F83" class="d-flex justify-center">
            <v-toolbar-title align-center>تفاصيل الحجز</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <v-data-table
                class="mx-auto mt-10"
                :headers="headers_order"
                :items="bookings"
                hide-default-footer>
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center font-weight-black">
                      {{ item.patint_name }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.age }}
                    </td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.gender == 1">
                      ذكر
                    </td>
                    <td class="text-center font-weight-black" v-else>انثى</td>

                    <td class="text-center font-weight-black">
                      {{ item.address }}
                    </td>
                    <td class="text-center font-weight-black">
                      {{ item.primary_diagonses }}
                    </td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.booking_type == 0">
                      التواصل الاجتماعي
                    </td>
                    <td
                      class="text-center font-weight-black"
                      v-else-if="item.booking_type == 1">
                      العيادة
                    </td>
                    <td class="text-center font-weight-black" v-else>صديق</td>
                    <td class="text-center font-weight-black">
                      {{ item.booking_note }}
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
      bookings: {
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
            text: "الجنس",
            align: "center",
            value: "gender",
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
          {
            text: "التشخيص الاولي",
            align: "center",
            value: "primary_diagonses",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "نوع الحجز",
            align: "center",
            value: "booking_type",
            class: "secondary white--text title",
            sortable: false,
          },
          {
            text: "ملاحظات",
            align: "center",
            value: "booking_note",
            class: "secondary white--text title",
          },
        ],
      };
    },
    methods: {},
  };
</script>
