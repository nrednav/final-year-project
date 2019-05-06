<template>
	<div class="session-list-container">

		<div v-if="sessions.length == 0" class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			No sessions found
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			sessions: []
		}
	},
	methods: {
		async get_sessions () {

		}
	},
	mounted () {
		this.get_sessions()
	}
}
</script>

<style>

</style>
