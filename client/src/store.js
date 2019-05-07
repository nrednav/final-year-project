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
			id: '',
			name: '',
			object: null
		},
		picture: require('@/assets/Blue_Mountains.jpg'),
		session_critical: false,
		property: null
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
		user_object: state => {
			return state.user.object
		},
		picture: state => {
			return state.picture
		},
		property: state => {
			return state.property
		},
		route_config: state => {
			const config = {
				headers: {
					Authorization: 'Bearer ' + localStorage.token
				}
			}
			return config
		},
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
			state.user.object = payload.user_object
		},
		add_property_data (state, payload) {
			state.property = payload.property
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
