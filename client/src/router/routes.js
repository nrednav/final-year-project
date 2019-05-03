function redirect_if_logged_in(to, from, next) {
	if (localStorage.token) {
		next('/select-profile')
	}
	else {
		next()
	}
}

function logged_in(to, from, next) {
	if (localStorage.token) {
		next()
	}
	else {
		next('/login')
	}
}

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
		component: () => import('@/views/both/Dashboard.vue'),
		beforeEnter: logged_in
	},

	// Registration
	{
		path: '/register',
		name: 'register',
		component: () => import('@/components/Authentication.vue'),
		beforeEnter: redirect_if_logged_in
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/components/Authentication.vue'),
		beforeEnter: redirect_if_logged_in
	},
	{
		path: '/select-profile',
		name: 'select-profile',
		component: () => import('@/views/both/Profile_Selection.vue'),
		beforeEnter: logged_in
	}
]
