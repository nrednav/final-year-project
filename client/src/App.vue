<template>
	<v-app class="p_dark">
		<Navbar v-if="!logged_in" />
		<v-content>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
	name: 'App',
	components: {
		Navbar
	},
	data () {
		return {
			logged_in: false
		}
	}
}
</script>

<style>
.heading {
	text-align: center;
}
</style>
