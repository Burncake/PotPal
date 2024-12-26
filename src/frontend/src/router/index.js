import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomeView.vue'
import AboutPage from '../views/AboutView.vue'
import ProductDetailsPage from '../views/ProductDetailsPage.vue'
import ContactPage from '../views/ContactPage.vue'
import ProductCategory from '../views/ProductCategory.vue'
import SearchRes from '../views/SearchRes.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/RegisterView.vue'
import AdminProductsView from '@/views/AdminProductsView.vue'
import AdminCategoriesView from '@/views/AdminCategoriesView.vue'
import CartView from '@/views/CartView.vue'
import AdminCustomerView from '@/views/AdminCustomerView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
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
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: SignupView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
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
    name: 'CartPage',
    component: CartView,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
