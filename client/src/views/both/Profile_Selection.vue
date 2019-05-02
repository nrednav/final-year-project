<template>
	<div class="profile_selection">
		<h1 class="heading white--text">Profile Selection</h1>

		<v-container class="my-5 mx-5">
			<v-layout row wrap>
				<v-flex v-for="profile in profiles" :key="profile.type" class="pa-4">
					<v-card elevation="4" class="primary" :to="profile.route">
						<v-card-text class="p_text--text display-1 text-xs-center">
							{{ profile.type }}
						</v-card-text>
						<v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg">
						</v-img>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
export default {
	data () {
		return {
			profiles: [
				{ type: 'BUYER', route: '/buyer/dashboard' },
				{ type: 'SELLER', route: '/seller/dashboard' }
			]
		}
	}
}
</script>

<style>

</style>
