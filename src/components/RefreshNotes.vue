<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-vue-next';

interface Props {
    isLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
});

const emit = defineEmits<{
    (e: 'click'): void;
}>();

</script>
<template>
    <Button variant="ghost" title="Click to refresh notes" aria-label="Refresh notes" :disabled="props.isLoading"
        :aria-busy="props.isLoading" @click="() => !props.isLoading && emit('click')">
        <RefreshCcw aria-hidden="true" focusable="false" :class="props.isLoading ? 'animate-spin' : ''" />
    </Button>
</template>
