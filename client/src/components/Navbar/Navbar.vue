<template>
	<nav>
		<v-navigation-drawer
			app
			permanent
			width="250"
			class="primary">
			<v-layout justify-space-between column fill-height>
				<v-list>
					<v-list-tile class="tile pt-4 pb-4" to="/">
						<v-list-tile-action>
							<v-icon
								color="p_text"
								large
								>
								fas fa-home
							</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title class="white--text text-xs-center">
								HOME
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-divider class="black"></v-divider>

					<template v-for="(link, index) in links">
						<v-list-tile
									class="tile pt-4 pb-4"
									:key="link.route"
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
						<v-divider v-if="index + 1 < links.length" :key="`divider-${index}`" class="black"></v-divider>
					</template>
					<v-divider class="black"></v-divider>
				</v-list>

				<v-list>

					<v-divider class="black"></v-divider>

					<v-list-tile v-if="!user_authenticated" class="tile pt-4 pb-4" v-on:click="register">
						<v-list-tile-action>
							<v-icon
								color="p_text"
								large
								>
								fas fa-plus-square
							</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title class="white--text text-xs-center">
								REGISTER
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-tile v-if="user_authenticated" class="tile pt-4 pb-4" v-on:click="selectProfile">
						<v-list-tile-action>
							<v-icon
								color="p_text"
								large
								>
								fas fa-users
							</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title class="white--text text-xs-center">
								SELECT PROFILE
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-divider class="black"></v-divider>

					<v-list-tile v-if="!user_authenticated" class="tile pt-4 pb-4" v-on:click="login">
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

					<v-list-tile v-if="user_authenticated" class="tile pt-4 pb-4" v-on:click="logout">
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
				{ icon: 'fas fa-info-circle', route: '/about', text: 'ABOUT' },
				{ icon: 'fas fa-envelope', route: '/contact', text: 'CONTACT' }
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
			this.$router.push('/login')
		},
		selectProfile () {
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
