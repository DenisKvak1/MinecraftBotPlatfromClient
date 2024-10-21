<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	backgroundPhotoURL: string,
	progressPhotoURL: string,
	progress: number,
	max?: number
}>();

const progressInPercent = computed(() => {
	return `${(Math.floor(props.progress*100)/100)*(100/(props.max || 1))}%`;
});

</script>

<template>
	<div
		class="progress-bar-container"
		:style="{
			backgroundImage: `url(${props.backgroundPhotoURL})`
		}">
		<div class="progress-bar">
			<div
				class="progress"
				:style="{
					backgroundImage: `url(${props.progressPhotoURL})`,
					width: progressInPercent
				}">
			</div>
		</div>
	</div>
</template>

<style scoped>
.progress-bar-container {
	width: 273px;
	height: 7.5px;
	background-size: contain;
	position: relative;
}

.progress-bar {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
}

.progress {
	height: 100%;
	background-size: cover;
	transition: width 0.5s ease;
}

@media (min-width: 768px) {
	.progress-bar-container {
		width: 432px;
		height: 12px;
	}
}
</style>
