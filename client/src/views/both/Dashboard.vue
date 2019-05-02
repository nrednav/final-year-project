<template>
	<v-layout column>
		<div class="dashboard">
			<v-container v-if="user == 'Buyer'" class="buyer-dashboard white--text">
				<v-card to="/buyer/search" class="browse-properties primary">
					<div class="text-xs-center pa-4 p_text--text
									display-1">
						BROWSE PROPERTIES
					</div>
				</v-card>

				<v-card class="info-panel primary text-xs-center pa-4 p_text--text">
					<v-card-media>
						<v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
						</v-img>
					</v-card-media>

					<v-card-text class="headline">
						Bob Jenkins
					</v-card-text>

					<v-divider class="p_text darken-2"></v-divider>

					<v-card-text class="subheading text-xs-left">
						Member since:
						<br><br>
						# Offers:
						<br><br>
						# Bought:
					</v-card-text>
				</v-card>

				<v-card class="notifications primary text-xs-center pa-4 p_text--text display-1" to="/buyer/notifications">
					<p>NOTIFICATIONS</p>
				</v-card>

				<v-card class="offers primary text-xs-center pa-4 p_text--text display-1" to="/buyer/offers">
					<p>OFFERS</p>
				</v-card>

				<v-card class="sessions primary text-xs-center pa-4 p_text--text display-1" to="/buyer/sessions">
					<p>SESSIONS</p>
				</v-card>
			</v-container>

			<v-container v-if="user == 'Seller'" class="mx5 my-5">
				Hello2
			</v-container>
		</div>
	</v-layout>
</template>

<script>
export default {
	data () {
		return {
			user: ''
		}
	},
	methods: {

	},
	computed: {

	},
	mounted () {
		let user = this.$route.params.user
		this.user = user[0].toUpperCase() + user.slice(1)
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

.notifications {
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

.sessions {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-column: 2 / 6;
	grid-row: 3 / 3;
	border-radius: 20px;
}

</style>
