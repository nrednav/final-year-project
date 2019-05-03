<template>
	<v-app class="p_dark">
		<template v-if="!logged_in">
			<Navbar />
		</template>
		<template v-else>
			<Navbar v-if="user == ''" />
			<BuyerNavbar v-if="user == 'buyer'" />
			<SellerNavbar v-if="user == 'seller'" />
		</template>
		<v-content>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import Navbar from '@/components/Navbar/Navbar'
import BuyerNavbar from '@/components/Navbar/BuyerNavbar'
import SellerNavbar from '@/components/Navbar/SellerNavbar'

export default {
	name: 'App',
	components: {
		Navbar,
		BuyerNavbar,
		SellerNavbar
	},
	data () {
		return {
		}
	},
	computed: {
		...mapGetters({
			logged_in: 'logged_in',
			user: 'user'
		})
	}
}
</script>

<style>
.heading {
	text-align: center;
}
</style>
