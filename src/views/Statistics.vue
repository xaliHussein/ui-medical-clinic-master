<template>
  <v-container>
    <v-row class="mb-3">
      <v-col
        cols="12"
        sm="6"
        md="6"
        v-for="(option, index) in statistics"
        class="mt-2"
        :key="index">
        <CardStatistics
          v-if="loading_statistics == false"
          :title="option.title"
          :icon="option.icon"
          :statistics="option.statistics"
          :color="option.color" />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="6"
        lg="6"
        v-for="(n, index) in 2"
        :key="'A' + index"
        class="mt-2">
        <v-card
          dir="ltr"
          class="card-skeleton"
          v-if="loading_statistics == true"
          max-width="500">
          <v-skeleton-loader
            class="mx-auto"
            max-width="500"
            type="list-item-avatar-three-line"></v-skeleton-loader>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="card" width="100%" :height="415">
          <v-card-title class="d-flex justify-center pb-0 mb-0"
            >احصائيات الارباح
          </v-card-title>
          <Pie
            v-if="loading_statistics == false"
            :width="width"
            :height="353"
            :chart-options="chartOptions"
            :chart-data="pie_profits" />
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="card" width="100%" :height="415">
          <v-card-title class="d-flex justify-center pb-0 mb-0"
            >احصائيات الصرفيات
          </v-card-title>
          <Pie
            v-if="loading_statistics == false"
            :width="width"
            :height="353"
            :chart-options="chartOptions"
            :chart-data="pie_losses" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import CardStatistics from "../components/layout/CardStatistics.vue";
  import { Pie } from "vue-chartjs/legacy";

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    PointElement,
  } from "chart.js";
  Title, Tooltip, Legend, ArcElement, CategoryScale;
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    PointElement
  );

  export default {
    components: { CardStatistics, Pie },
    name: "PieChart",
    props: {
      width: {
        type: Number,
        default: 400,
      },
      height: {
        type: Number,
        default: 270,
      },
    },
    data() {
      return {
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: "'Cairo', sans-serif",
                  weight: "bold",
                },
              },
            },
          },
        },
      };
    },

    mounted() {
      this.$store.dispatch("logs/get_statistics");
      this.$store.dispatch("logs/get_logs");
    },

    computed: {
      statistics() {
        return this.$store.state.logs.statistics;
      },

      loading_statistics() {
        return this.$store.state.logs.loading_statistics;
      },
      pie_profits() {
        return this.$store.state.logs.pie_profits;
      },
      pie_losses() {
        return this.$store.state.logs.pie_losses;
      },
    },
  };
</script>
<style>
  .card-skeleton {
    border-radius: 20px !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
  .card {
    border-radius: 25px !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
</style>
