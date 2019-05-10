function redirect_if_logged_in (to, from, next) {
	if (localStorage.token) {
		next('/select-profile')
	} else {
		next()
	}
}

function logged_in (to, from, next) {
	if (localStorage.token) {
		next()
	} else {
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
	{
		path: '/:user/sessions',
		name: 'sessions',
		component: () => import('@/views/both/SessionList.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/sessions/:session_id',
		name: 'session',
		component: () => import('@/views/both/ViewSession.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/sessions/:session_id/stage/1',
		name: 'holding-deposit',
		component: () => import('@/views/both/HoldingDeposit.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/sessions/:session_id/stage/2',
		name: 'background-screening',
		component: () => import('@/views/both/BackgroundScreening.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/sessions/:session_id/stage/3',
		name: 'sales-contract',
		component: () => import('@/views/both/SalesContract.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/sessions/:session_id/stage/4',
		name: 'escrow',
		component: () => import('@/views/both/Escrow.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/:user/notifications',
		name: 'notifications',
		component: () => import('@/views/both/Notifications.vue'),
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
		component: () => import('@/views/both/ProfileSelection.vue'),
		beforeEnter: logged_in
	},

	// Buyer Routes
	{
		path: '/buyer/search',
		name: 'property-search',
		component: () => import('@/views/buyer/PropertySearch.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/buyer/search/results',
		name: 'search-results',
		component: () => import('@/views/buyer/SearchResults.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/buyer/search/results/:property_id',
		name: 'buyer-view-property',
		component: () => import('@/views/both/ViewProperty.vue'),
		beforeEnter: logged_in
	},

	// Seller Routes
	{
		path: '/seller/properties',
		name: 'property-list',
		component: () => import('@/views/seller/PropertyList.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/seller/properties/add',
		name: 'add-property',
		component: () => import('@/views/seller/AddProperty.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/seller/properties/:property_id',
		name: 'seller-view-property',
		component: () => import('@/views/both/ViewProperty.vue'),
		beforeEnter: logged_in
	},
	{
		path: '/seller/properties/:property_id/verify',
		name: 'verify-property',
		component: () => import('@/views/seller/VerifyProperty.vue'),
		beforeEnter: logged_in
	}
]
