<template>
  <v-app class="app">
    <v-main style="background-color: #f0fcfa">
      <router-view />
      <SideBar v-if="loggedIn" />
      <SnackBar v-if="snackBar" :snack_message="snack_message" />
    </v-main>
  </v-app>
</template>

<script>
  import SnackBar from "./components/layout/Snackbar";
  import SideBar from "./components/layout/SideBar.vue";
  export default {
    components: { SideBar, SnackBar },
    name: "App",

    data() {
      return {};
    },
    computed: {
      loggedIn() {
        return this.$store.state.user_name;
      },
      snackBar() {
        return this.$store.getters.snack_bar;
      },
      snack_message() {
        return this.$store.state.snack_message;
      },
    },
  };
</script>
<style>
  .app {
    font-family: "Cairo", sans-serif;
    background-color: "#F0FCFA";
  }
  .v-dialog {
    border-radius: 25px !important;
  }
  .scroll {
    margin-left: 2px;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-left: 1px solid #dadada;
    border-radius: 100px;
  }
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(180deg, #57c5b6 0%, #1a5f7a 99%);
    /* background-image: linear-gradient(180deg, #e98ead 0%, #3a4f7a 99%); */
    border: solid 1px #e6e6e6;
    border-radius: 100px;
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
