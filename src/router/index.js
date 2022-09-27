import Vue from 'vue'
import VueRouter from 'vue-router'
import Medicos from '@/views/Medicos.vue'
import Calendario from '@/components/Calendario.vue'
import Home from '@/views/HomeView.vue'
import Servicios from '@/views/Servicios.vue'
import Agendas from '@/views/Agendas.vue'
//import About from '@/views/AboutView.vue'
import NewAgenda from '@/views/NewAgenda.vue'


Vue.use(VueRouter)

const routes = [

  {
    path: '/medicos',
    name: 'medicos',
    component: Medicos,
   
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: Calendario
  },
  {
  path: '/',
  name: 'home',
  component: Home
},
  {
  path: '/servicios',
  name: 'servicios',
  component: Servicios
},
  {
  path: '/agendas',
  name: 'agendas',
  component: Agendas
}
,
  {
  path: '/newagenda',
  name: 'newagenda',
  component: NewAgenda
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
