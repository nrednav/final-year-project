import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/general/Home.vue'
import { routes } from './routes.js'

Vue.use(Router)

export default new Router({
	routes,
	mode: 'history',
	base: process.env.BASE_URL
	//	routes: [
	//		{
	//			path: '/',
	//			name: 'home',
	//			component: Home
	//		},
	//		{
	//			path: '/about',
	//			name: 'about',
	//			component: () => import('./views/general/About.vue')
	//		},
	//		{
	//			path: '/contact',
	//			name: 'contact',
	//			component: () => import('./views/general/Contact.vue')
	//		},
	//		{
	//			path: '/register',
	//			name: 'register',
	//			component: () => import('./components/Authentication.vue')
	//		},
	//		{
	//			path: '/login',
	//			name: 'login',
	//			component: () => import('./components/Authentication.vue')
	//		}
	//	]
})
