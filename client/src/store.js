import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		logged_in: false,
		user: ''
	},
	getters: {
		logged_in: state => {
			return state.logged_in
		},
		user: state => {
			return state.user
		}
	},
	mutations: {

	},
	actions: {

	}
})
