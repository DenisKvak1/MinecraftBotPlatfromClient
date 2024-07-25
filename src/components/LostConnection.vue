<script setup lang="ts">

import {Dialog, DialogContent, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

const prop = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'reconnect'): void
}>()

</script>

<template>
<AlertDialog :open="open">
  <AlertDialogTrigger>
    <slot></slot>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Соеденение потерянно
      </AlertDialogTitle>
      <AlertDialogDescription>
        Соедениние с сервером потеряно.<br>
        Через 3 секунду автоматически будет осуществленная попытка переподключение
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button @click="emit('reconnect')">Переподключиться</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</template>

<style scoped>

</style>