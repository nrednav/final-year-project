import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		user: {
			type: '',
			authenticated: false
		},
		picture: require('@/assets/Blue_Mountains.jpg'),
		session_critical: false
	},
	getters: {
		user_authenticated: state => {
			return state.user.authenticated
		},
		user_type: state => {
			return state.user.type
		},
		picture: state => {
			return state.picture
		}
	},
	mutations: {
		update_user_status (state, payload) {
			if (localStorage.token) {
				state.user.authenticated = true
			} else {
				state.user.authenticated = false
			}
			state.user.type = payload.type
		}
	},
	actions: {
		update_user_status (context, payload) {
			context.commit('update_user_status', payload)
		}
	}
})
