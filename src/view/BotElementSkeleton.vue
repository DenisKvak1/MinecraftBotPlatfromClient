<script setup lang="ts">

import {Skeleton} from "@/components/ui/skeleton";
</script>

<template>
  <div class="element">
    <div class="flex items-center justify-end gap-4 w-full">
      <Skeleton class="nickname self-center w-[100px]"></Skeleton>
      <Skeleton class="w-6 h-6"/>
    </div>
    <div class="info">
      <Skeleton class="w-[130px] h-[28px] "></Skeleton>
      <Skeleton class="mt-2 w-[70px] h-[28px] "></Skeleton>
    </div>
    <div class="connectMenu">
      <button
          class="connectButton"
      >
        <Skeleton class="icon"/>
      </button>
      <Skeleton
          class="font-medium h-[28px] w-[78px]"
      >
      </Skeleton>
    </div>
  </div>
</template>

<style scoped>
.element {
  @apply w-44 h-44 border shadow-sm rounded-2xl p-4 flex flex-col items-center;
  @apply 2xl:w-60 2xl:h-60 2xl:p-6;
}
.nickname {
  @apply h-[28px] font-medium text-xl;
  @apply 2xl:text-3xl;
}
.info {
  @apply mt-2 self-start flex flex-col;
  @apply 2xl:mt-3 text-xl;
}
.connectMenu {
  @apply mt-auto flex justify-between w-full;
  @apply 2xl:justify-between 2xl:items-center 2xl:text-xl
}
.connectButton {
  @apply w-7 h-7;
  @apply 2xl:w-10 2xl:h-10;
}
.icon {
  @apply w-full h-full;
}

</style>