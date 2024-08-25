<script setup lang="ts">

import ScriptBlock from '@/components/ScriptBlock.vue';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ScriptEditor from '@/components/ScriptEditor.vue';
import { Button } from '@/components/ui/button';
</script>

<template>
	<div>
		<Dialog>
			<DialogTrigger as-child>
				<Button>Скрипты</Button>
			</DialogTrigger>
			<DialogContent class="p-1 md:max-w-[580px] md:p-3 lg:max-w-[680px] xl:p-4 xl:max-w-[735px]">
				<ScriptBlock></ScriptBlock>
			</DialogContent>
		</Dialog>
	</div>
</template>

<style scoped>

</style>