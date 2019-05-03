<template>
	<v-app class="p_dark">
		<template v-if="!user_authenticated">
			<Navbar />
		</template>
		<template v-else-if="user_authenticated">
			<Navbar v-if="user_type == ''" />
			<BuyerNavbar v-if="user_type == 'buyer'" />
			<SellerNavbar v-if="user_type == 'seller'" />
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
		...mapGetters([
			'user_authenticated',
			'user_type'
		])
	}
}
</script>

<style>
.heading {
	text-align: center;
}
</style>
