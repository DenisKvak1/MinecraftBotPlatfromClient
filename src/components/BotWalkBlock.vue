<script setup lang="ts">

import {Button} from "@/components/ui/button";
import {toggle} from "@/API/types";

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'CENTER'

const emit = defineEmits<{
  (e: 'action', data: {action: toggle, direction: Direction})
}>()
</script>

<template>
<div class="cont">
  <Button
      @pointerdown="emit('action', {action: 'START', direction: 'CENTER'})"
      @pointerup="emit('action', {action: 'STOP', direction: 'CENTER'})"
      @pointercancel="emit('action', {action: 'STOP', direction: 'CENTER'})"
      class="col-start-2 row-start-2 rounded-none h-[50px] md:h-[40px]"
  >
    <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
  </Button>
  <Button
      @pointerdown="emit('action', {action: 'START', direction: 'UP'})"
      @pointerup="emit('action', {action: 'STOP', direction: 'UP'})"
      @pointercancel="emit('action', {action: 'STOP', direction: 'UP'})"
      class="col-start-2 row-start-1 rounded-b-none h-[50px] md:h-[40px]"
  >
    <font-awesome-icon :icon="['fas', 'arrow-up']" />
  </Button>
  <Button
      @pointerdown="emit('action', {action: 'START', direction: 'RIGHT'})"
      @pointerup="emit('action', {action: 'STOP', direction: 'RIGHT'})"
      @pointercancel="emit('action', {action: 'STOP', direction: 'RIGHT'})"
      class="col-start-3 row-start-2 rounded-l-none h-[50px] md:h-[40px]"
  >
    <font-awesome-icon :icon="['fas', 'arrow-right']" />
  </Button>
  <Button
      @pointerdown="emit('action', {action: 'START', direction: 'LEFT'})"
      @pointerup="emit('action', {action: 'STOP', direction: 'LEFT'})"
      @pointercancel="emit('action', {action: 'STOP', direction: 'LEFT'})"
      class="col-start-1 row-start-2 rounded-r-none h-[50px] md:h-[40px]"
  >
    <font-awesome-icon :icon="['fas', 'arrow-left']" />
  </Button>
  <Button
      @pointerdown="emit('action', {action: 'START', direction: 'DOWN'})"
      @pointerup="emit('action', {action: 'STOP', direction: 'DOWN'})"
      @pointercancel="emit('action', {action: 'STOP', direction: 'DOWN'})"
      class="col-start-2 row-start-3 rounded-t-none h-[50px] md:h-[40px]"
  >
    <font-awesome-icon :icon="['fas', 'arrow-down']" />
  </Button>
</div>
</template>

<style scoped>
.cont {
  display: grid;
  grid-template-rows: repeat(3, 50px);
  grid-template-columns: repeat(3, 60px);
}
@media (min-width: 768px) {
  .cont {
    grid-template-rows: repeat(3, 40px);
    grid-template-columns: repeat(3, 50px);
  }
}
</style>