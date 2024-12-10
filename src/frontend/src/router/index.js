import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomeView.vue'
import AboutPage from '../views/AboutView.vue'
import ProductDetailsPage from '../views/ProductDetailsPage.vue'
import ContactPage from '../views/ContactPage.vue'
import ProductCategory from '../views/ProductCategory.vue'
import SearchRes from '../views/SearchRes.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/RegisterView.vue'
import AdminView from '@/views/AdminView.vue'
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
<<<<<<< HEAD
    path: '/admin/products',
    name: 'admin',
    component: AdminView,
  }
=======
    path: '/search',
    name: 'SearchRes',
    component: SearchRes,
  },
>>>>>>> 5a4113a18381b3602658b2570f9f344e507183aa
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
