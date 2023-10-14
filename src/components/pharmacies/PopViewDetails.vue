<template>
  <v-container>
    <v-row>
      <v-dialog :value="value" scrollable max-width="900px" dir="rtl">
        <v-card width="100%">
          <v-toolbar dark color="#177F83" class="d-flex justify-center">
            <v-toolbar-title align-center>تفاصيل الدواء</v-toolbar-title>
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
                      {{ item.barCode }}
                    </td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.image.length > 0">
                      <a :href="server + item.image" id="image">
                        <img
                          :src="server + item.image"
                          alt="image"
                          width="50px"
                          height="50px" />
                      </a>
                    </td>
                    <td class="text-center font-weight-black" v-else>لايوجد</td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.side_effect != null">
                      {{ item.side_effect }}
                    </td>
                    <td class="text-center font-weight-black" v-else>لايوجد</td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.description != null">
                      {{ item.description }}
                    </td>
                    <td class="text-center font-weight-black" v-else>لايوجد</td>
                    <td
                      class="text-center font-weight-black"
                      v-if="item.note != null">
                      {{ item.note }}
                    </td>
                    <td class="text-center font-weight-black" v-else>لايوجد</td>
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
            text: "باركود",
            value: "barCode",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "الصوره",
            value: "image",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "الاعراض الجانبية",
            value: "side_effect",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
          {
            text: "الوصف",
            value: "description",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
            width: 350,
          },
          {
            text: "ملاحظات",
            value: "note",
            class: "secondary white--text title",
            align: "center",
            sortable: false,
          },
        ],
      };
    },
    computed: {
      server() {
        return this.$store.state.server;
      },
    },
    methods: {},
  };
</script>
