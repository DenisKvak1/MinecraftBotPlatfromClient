<script setup lang="ts">

import { useBackendConnect } from '@/proccess/useBackendConnect';
import LostConnection from '@/components/LostConnection.vue';
import { useDelay } from '@/hook/useDelay';
import BotsListFeature from '@/features/BotsListFeature.vue';

const {isConnect, isNotConnect, reconnect, onConnect} = useBackendConnect()
const {isValue: isLazyNotConnect} = useDelay(isNotConnect, false)


</script>

<template>
  <div>
		<BotsListFeature></BotsListFeature>
    <LostConnection
        :open="isLazyNotConnect"
        @reconnect="reconnect"
    ></LostConnection>
  </div>
</template>

<style scoped>

</style>