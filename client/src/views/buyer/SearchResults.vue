<template>

	<div class="search-results-container">

		<div v-if="search_results.length > 1"
			class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			Found {{ search_results.length }} results
		</div>
		<div v-else
			class="pa-4 display-1 p_text--text font-weight-bold text-xs-center">
			Found {{ search_results.length }} result
		</div>

		<v-container v-if="search_results.length > 0">

			<v-card
				@click="viewProperty(property._id)"
				class="pa-4 primary search-results-card"
				v-for="property in search_results"
				:key="property._id">

				<v-layout row wrap class="">

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Name</div>
						<div class="subheading white--text">{{ property.details.name }}</div>
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
						<div class="title p_text--text font-weight-bold"># Beds:</div>
						<div class="subheading white--text">
							{{ property.details.bedroom_count }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold"># Baths:</div>
						<div class="subheading white--text">
							{{ property.details.bathroom_count}}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Price:</div>
						<div class="subheading white--text">
							{{ property.details.listing_price }}</div>
					</v-flex>

					<v-flex xs12 md6>
						<div class="title p_text--text font-weight-bold">Size:</div>
						<div class="subheading white--text">
							{{ property.details.size }}</div>
					</v-flex>

				</v-layout>

				<v-spacer></v-spacer>

			</v-card>

		</v-container>

	</div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
		}
	},

	methods: {
		viewProperty (id) {
			this.$router.push({ path: `/buyer/search/results/${id}` })
		}
	},

	computed: {
		...mapGetters(['search_results'])
	}

}
</script>

<style>

.search-results-card {
	margin: 2vh;
	border-radius: 25px;
}

	.search-results-card:hover {
		cursor: pointer;
	}

</style>
