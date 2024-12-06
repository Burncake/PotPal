import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomeView.vue';
import AboutPage from '../views/AboutView.vue';
import ProductDetailsPage from '../views/ProductDetailsPage.vue';
import ContactPage from '../views/ContactPage.vue';
import ProductCategory from '../views/ProductCategory.vue';
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
const routes = [
  {
    path: '/PotPal',
    name: 'home',
    component: HomePage
  },
  {
    path: '/PotPal/about',
    name: 'AboutPage',
    component: AboutPage
  },
  {
    path: '/PotPal/product/:id',
    name: 'productDetails',
    component: ProductDetailsPage
  },
  {
    path: '/PotPal/contact',
    name: 'ContactPage',
    component: ContactPage
  },
  {
    path: '/PotPal/category/:category',
    name: 'ProductCategory',
    component: ProductCategory
  },
  {
    path: '/PotPal/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/PotPal/register',
    name: 'register',
    component: SignupView,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
