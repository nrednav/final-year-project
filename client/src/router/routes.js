export const routes = [
	// General
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/general/Home.vue')
	},
	{
		path: '/about',
		name: 'about',
		component: () => import('@/views/general/About.vue')
	},
	{
		path: '/contact',
		name: 'contact',
		component: () => import('@/views/general/Contact.vue')
	},

	// Both
	{
		path: '/:user/dashboard',
		name: 'dashboard',
		component: () => import('@/views/both/Dashboard.vue')
	},

	// Registration
	{
		path: '/register',
		name: 'register',
		component: () => import('@/components/Authentication.vue')
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/components/Authentication.vue')
	},
	{
		path: '/select-profile',
		name: 'select-profile',
		component: () => import('@/views/both/Profile_Selection.vue')
	}
]
