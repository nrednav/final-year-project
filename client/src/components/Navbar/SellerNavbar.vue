<template>
	<nav>
		<v-navigation-drawer
			app
			permanent
			mini-variant
			class="primary">
			<v-layout justify-space-between column fill-height>
				<v-list>
					<v-divider class="black"></v-divider>

					<template v-for="(link, index) in links">
						<v-tooltip v-bind:key="index" right color="p_text">
							<template v-slot:activator="{ on }">
								<v-list-tile
											class="tile pt-4 pb-4"
											:key="link.route"
											v-on="on"
											router :to="link.route">
									<v-list-tile-action>
										<v-icon
											color="p_text"
											large
											>
											{{ link.icon }}
										</v-icon>
									</v-list-tile-action>
									<v-list-tile-content>
										<v-list-tile-title class="white--text text-xs-center">
											{{ link.text }}
										</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</template>
							<span>
								{{ link.text }}
							</span>
						</v-tooltip>
						<v-divider v-if="index + 1 < links.length" :key="`divider-${index}`" class="black"></v-divider>
					</template>
					<v-divider class="black"></v-divider>
				</v-list>

				<v-list>

					<v-divider class="black"></v-divider>

					<v-tooltip right color="p_text">
						<template v-slot:activator="{ on }">
							<v-list-tile v-if="user_authenticated" class="tile pt-4 pb-4"
																	v-on:click="switchProfile"
																	v-on="on">
								<v-list-tile-action>
									<v-icon
										color="p_orange"
										large
										>
										fas fa-random
									</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title class="white--text text-xs-center">
										SWITCH PROFILE
									</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						</template>
						<span>SWITCH PROFILE</span>
					</v-tooltip>

					<v-tooltip right color="p_text">
						<template v-slot:activator="{ on }">
							<v-list-tile v-if="user_authenticated" class="tile pt-4 pb-4"
																	v-on:click="logout"
																	v-on="on">
								<v-list-tile-action>
									<v-icon
										:color="login_status"
										large
										>
										fas fa-power-off
									</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title class="white--text text-xs-center">
										{{ login_status_text }}
									</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						</template>
						<span> {{ login_status_text }} </span>
					</v-tooltip>
				</v-list>

			</v-layout>
		</v-navigation-drawer>
	</nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			links: [
				{ icon: 'fas fa-chart-line', route: '/seller/dashboard', text: 'DASHBOARD' },
				{ icon: 'fas fa-plus', route: '/seller/properties/add', text: 'ADD' },
				{ icon: 'fas fa-search', route: '/seller/properties', text: 'VIEW' },
				{ icon: 'fas fa-bolt', route: '/seller/sessions', text: 'SESSIONS' },
				{ icon: 'fas fa-bell', route: '/seller/notifications', text: 'NOTIFICATIONS' }
			]
		}
	},
	methods: {
		register () {
			this.$router.push('/register')
		},
		login () {
			this.$router.push('/login')
		},
		logout () {
			localStorage.removeItem('token')
			localStorage.removeItem('vuex')
			this.$store.dispatch('update_user_status', { type: '' })
			this.$router.push('/')
		},
		switchProfile () {
			this.$store.dispatch('update_user_status', { type: '' })
			this.$router.push('/select-profile')
		}
	},
	computed: {
		login_status: function () {
			if (this.user_authenticated) {
				return 'p_red'
			} else {
				return 'p_blue'
			}
		},
		login_status_text: function () {
			if (this.user_authenticated) {
				return 'LOGOUT'
			} else {
				return 'LOGIN'
			}
		},
		...mapGetters([
			'user_authenticated'
		])
	}
}
</script>

<style scoped>

.tile:hover {
	background-color: #181c22;
}

</style>
