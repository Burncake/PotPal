import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomeView.vue'
import AboutPage from '../views/AboutView.vue'
import ProductDetailsPage from '../views/ProductDetailsPage.vue'
import ContactPage from '../views/ContactPage.vue'
import ProductCategory from '../views/ProductCategory.vue'
import SearchRes from '../views/SearchRes.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminProductsView from '@/views/AdminProductsView.vue'
import AdminCategoriesView from '@/views/AdminCategoriesView.vue'
import CartView from '@/views/CartView.vue'
import AdminCustomerView from '@/views/AdminCustomerView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import OrdersView from '@/views/OrdersView.vue'
import OrderDetails from '@/views/OrderDetails.vue'
import PaymentView from '@/views/PaymentView.vue'
import AdminOrdersView from '@/views/AdminOrdersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { UserStore } from '@/store/User'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage,
  },
  {
    path: '/product/:id',
    name: 'productDetails',
    component: ProductDetailsPage,
  },
  {
    path: '/order/:orderID',
    name: 'OrderDetails',
    component: OrderDetails, // Replace with your component name
  },
  {
    path: '/contact',
    name: 'ContactPage',
    component: ContactPage,
  },
  {
    path: '/category/:catID',
    name: 'ProductCategory',
    component: ProductCategory,
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
  },
  {
    path: '/admin/orders',
    name: 'adminOrders',
    component: AdminOrdersView,
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/products',
    name: 'adminProducts',
    component: AdminProductsView,
  },
  {
    path: '/admin/categories',
    name: 'adminCategories',
    component: AdminCategoriesView,
  },
  {
    path: '/admin/customers',
    name: 'adminCustomers',
    component: AdminCustomerView,
  },
  {
    path: '/search',
    name: 'SearchRes',
    component: SearchRes,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const uStore = UserStore()
  if (uStore.isLoggedIn) {
    if (to.name === 'login' || to.name === 'register') return next('/')

    if (!uStore.isAdmin && to.name === 'admin') {
      return next('/')
    }
    return next()
  } else {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
