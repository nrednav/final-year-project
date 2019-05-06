<template>
	<div class="notification-list-container">

		<div v-if="notifications.length == 0" class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			No notifications found
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			notifications: []
		}
	},
	methods: {
		async get_notifications () {

		}
	},
	mounted () {
		this.get_notifications()
	}
}
</script>

<style>

</style>
