import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		user: {
			type: '',
			authenticated: false,
			id: ''
		},
		picture: require('@/assets/Blue_Mountains.jpg'),
		session_critical: false,
		property: null,
		property_verification_status: 'pending'
	},
	getters: {
		user_authenticated: state => {
			return state.user.authenticated
		},
		user_type: state => {
			return state.user.type
		},
		user_id: state => {
			return state.user.id
		},
		picture: state => {
			return state.picture
		},
		property: state => {
			return state.property
		},
		property_verification_status: state => {
			return state.property_verification_status
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
		},
		add_user_id (state, payload) {
			state.user.id = payload.user_id
		},
		add_property_data (state, payload) {
			state.property = payload.property
		},
		update_property_verification_status (state, payload) {
			state.property_verification_status = payload.status
		}
	},
	actions: {
		update_user_status (context, payload) {
			context.commit('update_user_status', payload)
		},
		add_user_id (context, payload) {
			context.commit('add_user_id', payload)
		},
		async get_property_data (context, payload) {
			const response = await axios.get('http://localhost:3000/api/properties/' + payload.property_id,
				{
					headers: {
						Authorization: 'Bearer ' + localStorage.token
					}
				})
			context.commit('add_property_data', { property: response.data.result })
		}
	}
})
