<template>
  <div>
    <v-card class="card">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h4 mt-2">
            د.ع {{ statistics | formatNumber }}
          </v-list-item-title>
          <v-list-item-subtitle class="mb-3"
            ><h3>{{ title }}</h3></v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile size="80">
          <Icon :icon="icon" :color="color" width="30" />
        </v-list-item-avatar>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
  export default {
    props: {
      color: {
        type: String,
      },
      title: {
        type: String,
      },
      statistics: {
        type: Number,
      },
      icon: {
        type: String,
      },
    },
  };
</script>
<style scoped>
  .card {
    cursor: pointer;
    box-shadow: 0 5px 15px rgb(0 0 0 / 7%) !important;
    border-radius: 20px;
    transition: all ease 0.2s;
  }
  .card:hover {
    transition: all ease 0.2s;
    transform: scale(0.9);
    box-shadow: 0 5px 15px rgb(0 0 0 / 20%) !important;
  }
</style>
