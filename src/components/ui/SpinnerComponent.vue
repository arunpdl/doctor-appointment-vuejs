<template>
  <div :class="computedClasses"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const computedClasses = computed(() => {
  const baseClasses = 'border-4 border-gray-300 border-t-green-500 rounded-full animate-spin m-auto'
  const sizeClasses: Record<string, string> = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-20 h-20',
  }

  return [baseClasses, sizeClasses[props.size] || '', props.class].join(' ')
})
</script>
