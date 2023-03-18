import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  // { path: '/login', component: () => import('../components/Login.vue') },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    children: [
      { path: '/', component: () => import('../components/Welcome.vue') },
      { path: '/users', component: () => import('../components/user/Users.vue') },
      { path: '/rights', component: () => import('../components/right/Rights.vue') },
      { path: '/roles', component: () => import('../components/right/Roles.vue') },
      { path: '/goods', component: () => import('../components/good/Goods.vue') },
      { path: '/params', component: () => import('../components/good/Params.vue') },
      { path: '/categories', component: () => import('../components/good/Categories.vue') },
      { path: '/addgood', component: () => import('../components/good/Goods/AddGood.vue') },
      { path: '/orders', component: () => import('../components/order/Orders.vue') },
      { path: '/reports', component: () => import('../components/data/Reports.vue') },

    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
