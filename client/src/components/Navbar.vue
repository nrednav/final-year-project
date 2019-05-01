<template>
	<nav>
		<v-navigation-drawer
			v-model="drawer"
			app
			permanent
			width="200"
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

					<v-divider class="p_text darken-1"></v-divider>

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
						<v-divider v-if="index + 1 < links.length" :key="`divider-${index}`" class="p_text darken-1"></v-divider>
					</template>
					<v-divider class="p_text darken-1"></v-divider>
				</v-list>

				<v-list>

					<v-divider class="p_text darken-1"></v-divider>

					<v-list-tile class="tile pt-4 pb-4" to="/register">
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

					<v-divider class="p_text darken-1"></v-divider>

					<v-list-tile v-if="!logged_in" class="tile pt-4 pb-4" to="/login">
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

					<v-list-tile v-if="logged_in" class="tile pt-4 pb-4" to="/logout">
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
export default {
	data () {
		return {
			logged_in: false,
			links: [
				{ icon: 'fas fa-info-circle', route: '/about', text: 'ABOUT' },
				{ icon: 'fas fa-phone', route: '/contact', text: 'CONTACT' }
			]
		}
	},
	computed: {
		login_status: function () {
			if (this.logged_in) {
				return 'p_red'
			} else {
				return 'p_blue'
			}
		},
		login_status_text: function () {
			if (this.logged_in) {
				return 'LOGOUT'
			} else {
				return 'LOGIN'
			}
		}
	},
	methods: {
		logout: {

		}
	}
}
</script>

<style scoped>

.tile:hover {
	background-color: #181c22;
}

</style>
