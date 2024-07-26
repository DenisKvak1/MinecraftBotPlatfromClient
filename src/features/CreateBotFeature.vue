<script setup lang="ts">

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Label } from '@/components/ui/label'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {supportedVersions} from "../../env/config";



</script>

<template>
<Dialog :open="true">
  <DialogTrigger>
    <Button>Создать бота</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Создание бота: </DialogTitle>
      <DialogDescription>
        Заполните форму для создание бота.
      </DialogDescription>
    </DialogHeader>
    <form class="flex flex-col gap-4">
      <div class="form">
        <Label for="nickname">
          Никнейм:
        </Label>
        <Input id="nickname" placeholder="Никнейм бота"></Input>
      </div>
      <div class="form">
        <Label for="version">
          Версия:
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Версия клиента  бота"></SelectValue>
          </SelectTrigger>
          <SelectContent class="max-h-[300px] 2xl:max-h-[350px]">
            <SelectGroup>
                <SelectItem
                    v-for="version in supportedVersions"
                    :value="version"
                >{{version}}
                </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="form">
        <Label for="server">
          IP сервера:
        </Label>
        <Input id="server" placeholder="Адресс"></Input>
      </div>
      <div class="form">
        <Label for="port">
          Порт сервера:
        </Label>
        <Input id="port" placeholder="25565"></Input>
      </div>
    </form>
    <Button>Создать</Button>
  </DialogContent>
</Dialog>
</template>

<style scoped>
.form {
  @apply flex flex-col gap-1;
}
</style>