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
		}
];
