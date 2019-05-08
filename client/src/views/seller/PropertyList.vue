<template>
	<div class="property-list-container">
		<v-container v-if="properties.length > 0">

			<v-card @click="viewProperty(property._id)" class="pa-4 primary property-card" v-for="property in properties" :key="property._id">
				<v-layout row wrap class="">

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Property ID</div>
						<div class="subheading white--text">{{ property._id }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Name</div>
						<div class="subheading white--text">{{ property.details.name }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Verification Status</div>
						<div class="p_yellow--text">
							<v-icon color="p_green" v-if="property.verified == 2">fas fa-check</v-icon>
							<v-icon
								color="p_yellow"
								v-if="property.verified == 1">
								fas fa-spinner</v-icon>
							<v-icon color="p_red" v-if="property.verified == 0">fas fa-times</v-icon>
							<span v-if="property.verified == 0" class="p_red--text pl-2">-- Incomplete</span>
							<span v-if="property.verified == 1" class="p_yellow--text pl-2">-- Pending</span>
							<span v-if="property.verified == 2" class="p_green--text pl-2">-- Complete</span>
						</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Address</div>
						<div class="subheading white--text">
							{{ property.details.address.street }},
							{{ property.details.address.city }},
							{{ property.details.address.country }},
							{{ property.details.address.post_code }}
						</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Listed</div>
						<div>
							<v-icon color="p_green" v-if="property.listed">
								fas fa-check
							</v-icon>
							<v-icon color="p_red" v-if="!property.listed">
								fas fa-times
							</v-icon>
						</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Session Underway</div>
						<div>
							<v-icon color="p_green" v-if="property.session_underway">
								fas fa-check
							</v-icon>
							<v-icon color="p_red" v-if="!property.session_underway">
								fas fa-times
							</v-icon>
						</div>
					</v-flex>
				</v-layout>
				<v-spacer>

				</v-spacer>
			</v-card>

		</v-container>

		<div v-if="properties.length == 0" class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			No properties found
		</div>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
	data () {
		return {
			properties: []
		}
	},
	methods: {
		async get_properties () {
			const result = await axios.get('http://localhost:3000/api/users/' + this.user_id + '/properties', this.route_config)
			this.properties = result.data.properties
		},
		viewProperty (propertyId) {
			this.$router.push({ path: `/seller/properties/${propertyId}` })
		}
	},
	mounted () {
		this.get_properties()
	},
	computed: {
		user_id () {
			return this.$store.state.user.id
		},
		...mapGetters(['route_config'])
	}
}
</script>

<style>

.property-card {
	margin: 2vh;
	border-radius: 25px;
}

	.property-card:hover {
		cursor: pointer;
	}

</style>
