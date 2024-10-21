<script setup lang="ts">
import ProgressPhoto from '../assets/images/experience_bar_progress.png';
import ProgressBackgroundPhoto from '../assets/images/experience_bar_background.png';
import ProgressBar from '@/components/ProgressBar.vue';
import { computed, Reactive, reactive, ref, watch } from 'vue';
import { useLoadBot } from '@/proccess/useLoadBot';
import { useCurrentBotStore } from '@/store/currentBotStore';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { Experience } from '@/API/types';
import { Progress } from '@/components/ui/progress';

const props = defineProps<{
	botID: string
}>();
const computedBotID = computed(() => props.botID);
const { onConnectBot, onDisconnectBot } = useLoadBot(computedBotID);
const experience: Reactive<Experience> = reactive({
	points: 0,
	level: 0,
	progress: 0,
});

const initExp = async () => {
	const data = await webSocketBotAPI.getExp(props.botID);
	experience.level = data.data.level;
	experience.progress = data.data.progress;
	experience.points = data.data.points;
};
const clearExp = () => {
	experience.level = 0;
	experience.progress = 0;
	experience.points = 0;
};
webSocketBotAPI.$experience.subscribe((data) => {
	if (data.id !== props.botID) return;
	experience.level = data.experience.level;
	experience.progress = data.experience.progress;
	experience.points = data.experience.points;
});
const progressBottle = computed(() => {
	const localProgress = (experience.points % 5345) / 5345 * 100
	return localProgress <= 0 ? 0 : localProgress;
});

onConnectBot(initExp);
onDisconnectBot(clearExp);
watch(() => props.botID, initExp);
</script>

<template>
	<div>
		<div class="text-lg leading-5 relative font-medium text-center w-full text-green-600">{{ experience.level }}</div>
		<ProgressBar
			:progress="experience.progress"
			:progress-photo-u-r-l="ProgressPhoto"
			:background-photo-u-r-l="ProgressBackgroundPhoto"
		></ProgressBar>
		<div class="flex items-center">
			<span class="mr-1">{{ Math.floor((experience.points) / 5345) }}</span>
			<font-awesome-icon :icon="['fas', 'flask']" style="color: #000000;" />
			<Progress v-model="progressBottle" class="ml-1 w-24" />
		</div>
	</div>
</template>

<style scoped>

</style>