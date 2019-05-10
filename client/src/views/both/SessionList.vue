<template>
	<div class="session-list-container">

		<div v-if="sessions.length == 0" class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			No sessions found
		</div>

		<v-container v-if="sessions.length > 0">

			<v-card
				@click="viewSession(session._id)"
				class="pa-4 primary session-card"
				v-for="(session, index) in sessions"
				:key="session._id">

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Session ID</div>
						<div class="subheading white--text">{{ session._id }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Start Date</div>
						<div class="subheading white--text">
							{{ session.created_at.substr(0,10) }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Progress</div>
						<div class="subheading white--text">
							{{ session.progress }} / 4 </div>
					</v-flex>

					<div class="sl-card-pname" xs12 md6>
						<div class="title p_text--text font-weight-bold">Property Name</div>
						<div class="subheading white--text">
							{{ properties[index].details.name }} </div>
					</div>

					<div class="sl-card-address" xs12 md6>
						<div class="title p_text--text font-weight-bold">Address</div>
						<div class="subheading white--text">
							{{ properties[index].details.address.street }},
							{{ properties[index].details.address.city }},
							{{ properties[index].details.address.country }},
							{{ properties[index].details.address.post_code }}
						</div>
					</div>

			</v-card>

		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {

	data () {
		return {
			sessions: [],
			properties: []
		}
	},

	methods: {

		get_sessions () {
			axios.get(`http://localhost:3000/api/users/${this.user_id}/${this.user_type}/sessions`,
				this.route_config)
				.then((response) => {
					this.sessions = response.data.sessions
					this.get_properties()
				})
				.catch((error) => console.log(error))
		},

		get_properties () {
			var propertyIds = []
			var i
			for (i in this.sessions) {
				propertyIds[i] = this.sessions[i].property_id
			}
			axios.post('http://localhost:3000/api/properties/find-by-ids', { propertyIds: JSON.stringify(propertyIds) },
				this.route_config)
				.then((response) => {
					this.properties = response.data.properties
				})
				.catch((error) => console.log(error))
		},

		viewSession (id) {
			this.$router.push({ path: `/${this.user_type}/sessions/${id}` })
		}
	},

	computed: {
		...mapGetters(['user_id', 'user_object', 'user_type', 'route_config'])
	},

	mounted () {
		this.get_sessions()
	}
}
</script>

<style>

.session-card {
	margin: 5vh;
	border-radius: 25px;
	display: grid;
	grid-template-columns: repeat(3, minmax(10vw, auto));
	grid-template-rows: repeat(2, 10vh);
	grid-gap: 1vmax;
	align-items: center;
	justify-items: start;
}

	.session-card:hover {
		cursor: pointer;
	}

.sl-card-address {
	grid-column: 2 / 4;
	grid-row: 2;
	width: 100%;
}

.sl-card-pname {
	grid-column: 1 / 2;
	grid-row: 2;
	width: 100%;
}

</style>
