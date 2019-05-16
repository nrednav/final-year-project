<template>
	<v-layout column class="vs-main-container">

		<div class="pa-4 stage-selector text-xs-center">

			<div
				@click="viewStage(1)"
				:class="statusColor(1)"
				class="stage-1-circle stage-circle"></div>
			<span class="p_text--text headline stage-1-label">
				Stage 1<br>Holding Deposit</span>

			<div
				@click="viewStage(2)"
				:class="statusColor(2)"
				class="stage-2-circle stage-circle"></div>
			<span class="p_text--text headline stage-2-label">
				Stage 2<br>Background Screening</span>

			<div
				@click="viewStage(3)"
				:class="statusColor(3)"
				class="stage-3-circle stage-circle"></div>
			<span class="p_text--text headline stage-3-label">
				Stage 3<br>Sales Contract</span>

			<div
				@click="viewStage(4)"
				:class="statusColor(4)"
				class="stage-4-circle stage-circle"></div>
			<span class="p_text--text headline stage-4-label">
				Stage 4<br>Escrow</span>

		</div>

		<div class="session-meta-container">
			<v-card class="session-meta-card primary p_text--text display-1">
				<div class="vs-session-metadata">
					Session Metadata
				</div>
				<div class="vs-property-metadata">
					Property Metadata
				</div>
			</v-card>
		</div>

		<div class="pa-4 vs-button-container">
			<v-btn
				@click="goBack"
				color="p_text"
				outline
				class="title btn-vs-back">
				BACK
			</v-btn>
		</div>

	</v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {

	data () {
		return {
			session: {}
		}
	},

	methods: {

		getSession () {
			var sessionId = this.$route.params.session_id
			var requestUrl = `http://localhost:3000/api/sessions/get/${sessionId}`
			var config = { headers: { Authorization: 'a1b2c3d4e5f6g7' } }
			axios.get(requestUrl, config).then((response) => {
				this.session = response.data.result
				console.log(this.session)
			}).catch((error) => console.log(error))
		},

		viewStage (stageNumber) {
			var sessionId = this.$route.params.session_id
			var viewable = false
			var prevStage = stageNumber - 1
			prevStage = prevStage.toString()

			if (stageNumber === 1) {
				viewable = true
			} else {
				if (this.session.stages[prevStage].status !== 'Completed') {
					alert('You have not yet completed the previous stage')
				} else {
					viewable = true
				}
			}

			if (viewable) {
				var toRoute = `/${this.user_type}/sessions/${sessionId}/stage/${stageNumber}`
				this.$store.commit('add_session', { session: this.session })
				this.$router.push(toRoute)
			}
		},

		statusColor (stageNumber) {
			var status = this.session.stages[`${stageNumber}`].status
			if (status === 'Pending') {
				return { p_red: true }
			} else if (status === 'In Progress') {
				return { p_yellow: true }
			} else {
				return { p_green: true }
			}
		},

		openLeaveSessionDialog () {

		},

		goBack () {
			this.$router.go(-1)
		}
	},

	computed: {
		...mapGetters(['user_id', 'user_type'])
	},

	mounted () {
		this.getSession()
	}
}
</script>

<style>

.vs-main-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(3, 1fr));
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.stage-selector {
	display: grid;
	grid-template-columns: repeat(4, minmax(15vw, auto));
	grid-template-rows: repeat(2, 1fr);
	column-gap: 7vw;
	row-gap: 5vh;
	justify-items: center;
}

.stage-circle {
	border-radius: 50%;
	width: 4vmax;
	height: 4vmax;
}

	.stage-circle:hover {
		cursor: pointer;
	}

.stage-1-circle {
	grid-column: 1;
	grid-row: 1;
}

.stage-2-circle {
	grid-column: 2;
	grid-row: 1;
}

.stage-3-circle {
	grid-column: 3;
	grid-row: 1;
}

.stage-4-circle {
	grid-column: 4;
	grid-row: 1;
}

.stage-1-label {
	grid-column: 1;
	grid-row: 2;
}

.session-meta-container {
	margin-top: 10vh;
	width: 90%;
}

.session-meta-card {
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, 1fr);
	grid-gap: 5vmax;
	align-items: center;
	justify-items: center;
	height: 67vh;
	padding: 3vmax;
}

.vs-session-metadata {
	grid-row: 1;
	grid-column: 1 / 4;
}

.vs-property-metadata {
	grid-row: 2;
	grid-column: 1 / 4;
}

.vs-button-container {
	margin-top: 5vh;
}

.btn-vs-back {
	border-radius: 10px;
	width: 20vw;
	height: 10vh;
}
.btnLeaveSession {
	border-radius: 10px;
	width: 20vw;
	height: 10vh;
}

</style>
