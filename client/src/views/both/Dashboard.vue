<template>
	<v-layout column>
		<div class="dashboard">
			<v-container v-if="user_type == 'buyer'" class="buyer-dashboard white--text">
				<v-card to="/buyer/search" class="browse-properties primary">
					<div class="text-xs-center pa-4 p_text--text
									display-1">
						BROWSE PROPERTIES
					</div>
				</v-card>

				<v-card class="info-panel primary text-xs-center pa-4 p_text--text">

					<v-card-text
						class="display-1 pa-4 p_blue--text">
						{{ user_type.toUpperCase() }}
					</v-card-text>

					<v-responsive>
						<v-avatar size="200">
							<v-img :src="picture" max-height="200">
							</v-img>
						</v-avatar>
					</v-responsive>

					<v-card-text class="headline">
						{{ user.name }}
					</v-card-text>

					<v-divider class="p_text darken-2"></v-divider>

					<v-card-text class="subheading text-xs-center pt-4">
						Member since: {{ user.created_at.substring(0,10) }}
						<br><br>
						# Offers: {{ buyer_profile.offers.length }}
						<br><br>
						# Sessions: {{ buyer_profile.sessions.length }}
					</v-card-text>
				</v-card>

				<v-card class="b-notifications primary text-xs-center pa-4 p_text--text display-1" to="/buyer/notifications">
					<p>NOTIFICATIONS</p>
				</v-card>

				<v-card class="offers primary text-xs-center pa-4 p_text--text display-1" to="/buyer/offers">
					<p>OFFERS</p>
				</v-card>

				<v-card class="b-sessions primary text-xs-center pa-4 p_text--text display-1" to="/buyer/sessions">
					<p>SESSIONS</p>
				</v-card>
			</v-container>

			<v-container v-if="user_type == 'seller'" class="seller-dashboard white--text">
				<v-card class="info-panel primary text-xs-center pa-4 p_text--text">

					<v-card-text
						class="display-1 pa-4 p_blue--text">
						{{ user_type.toUpperCase() }}
					</v-card-text>

					<v-responsive>
						<v-avatar size="200">
							<v-img :src="picture" max-height="200">
							</v-img>
						</v-avatar>
					</v-responsive>

					<v-card-text class="headline">
						{{ user.name }}
					</v-card-text>

					<v-divider class="p_text darken-2"></v-divider>

					<v-card-text class="subheading text-xs-center">
						Member since: {{ user.created_at.substring(0,10) }}
						<br><br>
						# Added: {{ seller_profile.properties.length }}
						<br><br>
						# Verified: {{ seller_profile.verified_count }}
						<br><br>
						# Listed: {{ seller_profile.listed_count }}
						<br><br>
						# Sessions: {{ seller_profile.sessions.length }}
					</v-card-text>
				</v-card>

				<v-card class="s-notifications primary text-xs-center pa-4 p_text--text display-1" to="/seller/notifications">
					<p>NOTIFICATIONS</p>
				</v-card>

				<v-card class="s-sessions primary text-xs-center pa-4 p_text--text display-1" to="/seller/sessions">
					<p>SESSIONS</p>
				</v-card>

				<v-card class="add-properties primary text-xs-center pa-4 p_text--text display-1" to="/seller/properties/add">
					<p>ADD PROPERTY</p>
				</v-card>

				<v-card class="view-properties primary text-xs-center pa-4 p_text--text display-1" to="/seller/properties">
					<p>VIEW PROPERTIES</p>
				</v-card>
			</v-container>
		</div>
	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
	data () {
		return {
			user: null
		}
	},
	methods: {
		authorize_user () {
			axios.get('http://localhost:3000/', {
				headers: {
					Authorization: 'Bearer ' + localStorage.token
				}
			})
				.then((result) => {
					if (result.data.user) {
						this.get_user(result.data.user)
					} else {
						localStorage.removeItem('token')
						this.$store.dispatch('update_user_status', { type: '' })
						this.$router.push('/login')
					}
				})
				.catch((error) => console.error(error))
		},
		get_user (result) {
			axios.get('http://localhost:3000/api/users/get/' + result._id, {
				headers: {
					Authorization: 'Bearer ' + localStorage.token
				}
			})
				.then((result) => {
					this.user = result.data.user
					this.$store.dispatch('add_user_id', { user_id: result.data.user._id,
						user_object: result.data.user })
				})
				.catch((error) => console.error(error))
		}
	},
	computed: {
		...mapGetters([
			'user_type',
			'picture'
		]),
		seller_profile () {
			return this.user.profiles.seller
		},
		buyer_profile () {
			return this.user.profiles.buyer
		}
	},
	mounted () {
		this.authorize_user()
	}
}
</script>

<style>

.buyer-dashboard {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(3, 25vh);
	grid-gap: 50px;
	max-width: 100vw;
}

.seller-dashboard {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(3, 25vh);
	grid-gap: 50px;
	max-width: 100vw;
}

.info-panel {
	grid-column: 6 / 6;
	grid-row: 1 / 4;
	width: 20vw;
	border-radius: 20px;
}

.browse-properties {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 6;
	grid-row: 1 / 1;
	border-radius: 20px;
}

.b-notifications {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 6;
	grid-row: 2 / 2;
	border-radius: 20px;
}

.s-notifications {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 6;
	grid-row: 1 / 1;
	border-radius: 20px;
}

.s-sessions {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 6;
	grid-row: 2 / 2;
	border-radius: 20px;
}

.offers {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 1;
	grid-row: 3 / 3;
	width: 25vw;
	border-radius: 20px;
}

.add-properties {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 1 / 1;
	grid-row: 3 / 3;
	width: 25vw;
	border-radius: 20px;
}

.b-sessions {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 2 / 6;
	grid-row: 3 / 3;
	border-radius: 20px;
}

.view-properties {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 2 / 6;
	grid-row: 3 / 3;
	border-radius: 20px;
}

</style>
