import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/Login.vue";
import MedicalClinic from "../views/MedicalClinic.vue";
import EmployeesView from "../views/Employees.vue";
import MedicineWarehouse from "../views/MedicineWarehouse.vue";
import BookingsView from "../views/Bookings.vue";
import ArchivesView from "../views/Archives.vue";
import RepresentativesView from "../views/Representatives.vue";
import UsersView from "../views/Users.vue";
import PharmaciesView from "../views/Pharmacies.vue";
import DebtsView from "../views/Debts.vue";
import PharmacySales from "../views/OrdersPharmcy/PharmacySales.vue";
import OrderClinic from "../views/OrdersPharmcy/OrderClinic.vue";
import OrderPharmcy from "../views/OrdersPharmcy/OrderPharmcy.vue";
import StatisticsView from "../views/Statistics.vue";
import LogsView from "../views/logs.vue";
import ExpiredsView from "../views/Expireds.vue";
import Expireds_Store from "../views/ExpiredsStore.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  //   beforeEnter: loggedIn,
  // },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    beforeEnter: redirect,
  },
  {
    path: "/",
    name: "medical_clinic",
    component: MedicalClinic,
    beforeEnter: (loggedIn, manager),
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
    beforeEnter: (loggedIn, admin_clinic),
  },
  {
    path: "/employees",
    name: "employees",
    component: EmployeesView,
    beforeEnter: (loggedIn, admin_clinic),
  },
  {
    path: "/financial-transactions",
    name: "financial_transactions",
    component: LogsView,
    beforeEnter: loggedIn,
  },
  {
    path: "/statistics",
    name: "statistics",
    component: StatisticsView,
    beforeEnter: (loggedIn, admin_clinic),
  },
  {
    path: "/medicine-warehouse",
    name: "medicine_warehouse",
    component: MedicineWarehouse,
    beforeEnter: loggedIn,
  },
  {
    path: "/bookings",
    name: "bookings",
    component: BookingsView,
    beforeEnter: loggedIn,
  },
  {
    path: "/representatives",
    name: "representatives",
    component: RepresentativesView,
    beforeEnter: loggedIn,
  },
  {
    path: "/archives",
    name: "archives",
    component: ArchivesView,
    beforeEnter: loggedIn,
  },
  {
    path: "/pharmacy",
    name: "pharmacy",
    component: PharmaciesView,
    beforeEnter: loggedIn,
  },
  {
    path: "/debts",
    name: "debts",
    component: DebtsView,
    beforeEnter: loggedIn,
  },
  {
    path: "/pharmcy-sales",
    name: "pharmacy_sales",
    component: PharmacySales,
    beforeEnter: loggedIn,
  },
  {
    path: "/order-clinic",
    name: "order_clinic",
    component: OrderClinic,
    beforeEnter: loggedIn,
  },
  {
    path: "/order-pharmcy",
    name: "order_pharmcy",
    component: OrderPharmcy,
    beforeEnter: loggedIn,
  },
  {
    path: "/expireds",
    name: "expireds",
    component: ExpiredsView,
    beforeEnter: loggedIn,
  },
  {
    path: "/expireds-store",
    name: "expireds_store",
    component: Expireds_Store,
    beforeEnter: loggedIn,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

function manager(to, from, next) {
  const user_type = localStorage.getItem("user_type");
  if (user_type == 0) {
    next();
  } else if (user_type == 1) {
    next("/users");
  } else if (user_type == 2 || user_type == 3) {
    next("/bookings");
  } else {
    next("/pharmacy");
  }
}
function admin_clinic(to, from, next) {
  const user_type = localStorage.getItem("user_type");
  if (user_type == 1 || user_type == 0) {
    next();
  } else if (user_type == 2 || user_type == 3) {
    next("/bookings");
  } else {
    next("/pharmacy");
  }
}
function loggedIn(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    next("/login");
  } else {
    next();
  }
}
function redirect(to, from, next) {
  const token = localStorage.getItem("token");
  if (token) {
    next("/");
  } else {
    next();
  }
}
