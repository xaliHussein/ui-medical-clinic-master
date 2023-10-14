<template>
  <v-row justify="center">
    <v-dialog :value="value" persistent max-width="390">
      <v-card class="card">
        <v-toolbar dark class="d-flex justify-center" color="#177F83">
          <v-toolbar-title align-center> حذف الدين</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="mt-4 d-flex justify-stert"
          ><h4>هل أنت متأكد من عملية الحذف</h4></v-card-title
        >
        <v-card-actions class="mt-2 pb-5 mr-3">
          <v-btn
            v-on:click="$emit('deleteDebt')"
            :loading="loading"
            color="#159895"
            class="px-4"
            elevation="4">
            <h4 style="color: white; font-size: 17px">تاكيد</h4>
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
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    props: {
      value: Boolean,
    },
    computed: {
      loading() {
        return this.$store.state.debts.pop_loading;
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
