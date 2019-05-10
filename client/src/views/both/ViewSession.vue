<template>
	<v-layout column class="vs-main-container">

		<div class="stage-selector">

			<div class="p_green stage-1-circle">
			</div>
			<span class="p_text--text headline stage-1-label">Stage 1</span>

			<div class="p_yellow stage-2-circle">
			</div>
			<span class="p_text--text headline stage-2-label">Stage 2</span>

			<div class="p_yellow stage-3-circle">
			</div>
			<span class="p_text--text headline stage-3-label">Stage 3</span>

			<div class="p_red stage-4-circle">
			</div>
			<span class="p_text--text headline stage-4-label">Stage 4</span>

		</div>

		<div class="session-metadata">

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

.vs-main-container {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	justify-items: center;
	align-items: center;
	overflow-wrap: break-word;
	word-wrap: break-word;
	hyphens: auto;
	height: 100vh;
}

.stage-selector {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(2, 1fr);
	column-gap: 15vw;
	row-gap: 5vh;
	justify-items: center;
}

.stage-1-circle {
	grid-column: 1;
	grid-row: 1;
	border-radius: 50%;
	width: 4vw;
	height: 4vw;
}

.stage-2-circle {
	grid-column: 2;
	grid-row: 1;
	border-radius: 50%;
	width: 4vw;
	height: 4vw;
}

.stage-3-circle {
	grid-column: 3;
	grid-row: 1;
	border-radius: 50%;
	width: 4vw;
	height: 4vw;
}

.stage-4-circle {
	grid-column: 4;
	grid-row: 1;
	border-radius: 50%;
	width: 4vw;
	height: 4vw;
}

.stage-1-label {
	grid-column: 1;
	grid-row: 2;
}

</style>
