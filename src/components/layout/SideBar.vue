<template>
  <div>
    <!-- <v-app-bar color="white" app clipped-right clipped-left elevation="4">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MEDO STORE</v-toolbar-title>
    </v-app-bar> -->
    <v-navigation-drawer
      dir="ltr"
      :clipped="clipped"
      v-model="drawer"
      nable-resize-watcher
      app
      right
      class="navigation-drawer">
      <v-list-item>
        <v-list-item-avatar>
          <Icon icon="guidance:medical-laboratory" color="white" width="50" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            ><h2 class="text-center mt-4 mb-4" style="color: white">
              ميداس للعيادات
            </h2></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item-group mandatory v-model="model" color="#A6E5D5">
          <v-list-item
            v-for="(opation, index) in filteredItems"
            :key="index"
            :to="opation.link"
            @click="model = index"
            :class="model == index ? 'list-item' : ''"
            class="list-itemAll">
            <v-list-item-action
              v-if="opation.exp == true && loading == false"
              class="mx-auto">
              <v-btn icon>
                <v-badge color="#D32F2F" :content="expired"> </v-badge>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action
              v-if="opation.exp_store == true && loading_stores == false"
              class="mx-auto">
              <v-btn icon>
                <v-badge color="#D32F2F" :content="expired_stores"> </v-badge>
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="d-flex justify-end mr-2">
                <h3
                  :class="
                    model == index ? 'color-icon-title-D' : 'color-icon-title-A'
                  ">
                  {{ opation.title }}
                </h3>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon class="icons">
              <Icon
                :icon="opation.icon"
                :class="
                  model == index ? 'color-icon-title-D' : 'color-icon-title-A'
                "
                width="30" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
       <template v-slot:append>
          <div class="d-flex justify-center">
             <v-btn
            class="btn-logout"
            x-large
            @click="logout"
            color="white"
            outlined>
            <h4>تسجيل خروج</h4>
            <Icon icon="majesticons:logout-line" color="white" width="32" />
          </v-btn>

          </div>
        </template>
    </v-navigation-drawer>
  </div>
</template>
<script>
  export default {
    data: () => ({
      drawer: true,
      model: 0,
      group: null,
      clipped: false,
      opations: [
        {
          title: "العيادات",
          icon: "fa6-solid:house-medical-circle-check",
          link: "/",
          type: 0,
          type2: 0,
        },
        {
          title: "الحصائيات",
          icon: "wpf:statistics",
          link: "statistics",
          type: 1,
          type2: 1,
        },
        {
          title: "المستخدمين",
          icon: "mdi:users-add",
          link: "users",
          type: 0,
          type2: 1,
        },
        {
          title: "حجز جلسة",
          icon: "mdi:file-account",
          link: "/bookings",
          type: 1,
          type2: 2,
          type3: 3,
        },
        {
          title: "حركات مالية",
          icon: "solar:wallet-money-bold",
          link: "/financial-transactions",
          type: 1,
          type2: 3,
        },
        {
          title: "التسديدات",
          icon: "solar:chat-round-money-bold",
          link: "/debts",
          type: 1,
          type2: 3,
        },
        {
          title: "الموظفين",
          icon: "mdi:users-group",
          link: "/employees",
          type: 1,
          type2: 1,
        },

        {
          title: "المندوبين",
          icon: "iconamoon:delivery-fast-fill",
          link: "/representatives",
          type: 1,
          type2: 1,
        },
        {
          title: "مخزن الادوية",
          icon: "mdi:drugs",
          link: "/medicine-warehouse",
          type: 1,
          type2: 2,
          type3: 3,
        },
        {
          title: "تاريخ الصلاحية",
          icon: "pajamas:expire",
          link: "/expireds-store",
          type: 1,
          type2: 3,
          exp_store: true,
        },
        {
          title: "الارشيف",
          icon: "mdi:book-check",
          link: "/archives",
          type: 1,
          type2: 2,
          type3: 3,
        },
        {
          title: "صيدلية",
          icon: "healthicons:pharmacy",
          link: "/pharmacy",
          type: 4,
        },
        {
          title: "تاريخ الصلاحية",
          icon: "pajamas:expire",
          link: "/expireds",
          type: 4,
          exp: true,
        },

        {
          title: "طلبات العيادة",
          icon: "material-symbols:order-play",
          link: "/order-clinic",
          type: 4,
        },
        {
          title: "طلبات الصيدلية",
          icon: "material-symbols:order-approve-rounded",
          link: "/order-pharmcy",
          type: 4,
        },
        {
          title: "المبيعات",
          icon: "icon-park-solid:transaction-order",
          link: "/pharmcy-sales",
          type: 4,
        },
      ],
    }),

    computed: {
      loading() {
        return this.$store.state.pharmacies.table_loading;
      },
      loading_stores() {
        return this.$store.state.stores.table_loading;
      },
      expired() {
        return this.$store.state.pharmacies.expired_medication.length;
      },
      expired_stores() {
        return this.$store.state.stores.expired_stores.length;
      },
      user_type() {
        return this.$store.state.user_type;
      },
      filteredItems() {
        return this.opations.filter(
          (opation) =>
            opation.type == this.user_type ||
            opation.type2 == this.user_type ||
            opation.type3 == this.user_type
        );
      },
    },
    methods: {
      logout() {
        this.$store.dispatch("logout");
      },
    },
  };
</script>

<style scoped>
  .btn-logout {
    margin-bottom: 30px;
    border-radius: 15px !important;
  }
  .navigation-drawer {
    background: rgb(47, 138, 128);
    background: linear-gradient(
      180deg,
      rgba(47, 138, 128, 1) 30%,
      rgba(23, 127, 131, 1) 59%
    );
  }
  .v-list-item:before {
    border-radius: 15px !important;
    background: rgb(185, 237, 221) !important;
    opacity: 0;
  }

  .list-item {
    border-radius: 15px !important;
    background: rgb(185, 237, 221, 0.8) !important;
  }
  .list-itemAll:hover {
    border-radius: 15px !important;
    background: rgb(185, 237, 221, 0.8) !important;
  }
  .color-icon-title-A {
    color: rgb(255, 255, 255, 0.8);
  }
  .color-icon-title-D {
    color: rgb(255, 255, 255);
  }
  .type_zero {
    margin-top: 450px;
  }
  .type_one {
    margin-top: 29px;
  }
  .type_two {
    margin-top: 239px;
  }
  .type_three_four {
    margin-top: 99px;
  }
</style>
