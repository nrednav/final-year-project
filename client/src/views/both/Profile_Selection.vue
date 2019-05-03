<template>
	<div class="profile_selection">
		<h1 class="heading white--text">Profile Selection</h1>

		<v-container class="profile-selection">
			<v-flex v-for="profile in profiles" :key="profile.type" class="pa-4">
				<v-card elevation="4" class="clickable-card primary" @click="selectProfile(profile.type)">
					<v-card-text class="p_text--text display-1 text-xs-center">
						{{ profile.type }}
					</v-card-text>
					<v-img height="250">
					</v-img>
				</v-card>
			</v-flex>
		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			profiles: [
				{ type: 'BUYER', route: '/buyer/dashboard' },
				{ type: 'SELLER', route: '/seller/dashboard' }
			]
		}
	},
	methods: {
		selectProfile (_type) {
			this.$store.dispatch('update_user_status', { type: _type.toLowerCase() })
			this.$router.push('/' + _type.toLowerCase() + '/dashboard')
		}
	},
	computed: {
		...mapGetters([
			'picture'
		])
	}
}
</script>

<style>

.clickable-card {
	border-radius: 20px;
	cursor: pointer;
}

.profile-selection {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(1, minmax(50vh, auto));
	grid-gap: 50px;
	max-width: 100vw;
}
</style>
