<template>
	<v-layout column class="main-ec-container">

		<h1 class="display-3 p_text--text font-weight-bold">
			Stage 4: Escrow
		</h1>

		<div class="ec-card-container">
			<v-card class="primary p_text--text pa-4 ec-card display-1">
				:)
			</v-card>
		</div>

	</v-layout>
</template>

<script>
export default {
	data () {
		return {

		}
	}
}
</script>

<style>

.main-ec-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
}

.ec-card-container {
	margin-top: 10vh;
	width: 90%;
}

.ec-card {
	border-radius: 25px;
}

</style>
