import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomeView.vue'
import AboutPage from '../views/AboutView.vue'
import ProductDetailsPage from '../views/ProductDetailsPage.vue'
import ContactPage from '../views/ContactPage.vue'
import ProductCategory from '../views/ProductCategory.vue'
import SearchRes from '../views/SearchRes.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/RegisterView.vue'
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
    path: '/search',
    name: 'SearchRes',
    component: SearchRes,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
