<template>
  <v-container>
    <Table />
  </v-container>
</template>

<script>
  import Table from "../../components/orders_pharmcy/TableOrderClinic.vue";
  export default {
    components: { Table },
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
