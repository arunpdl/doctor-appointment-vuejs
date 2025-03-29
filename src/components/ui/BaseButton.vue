<template>
  <button :class="computedClasses" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  fullWidth?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
  fullWidth: false,
})

const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const computedClasses = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition duration-200'
  const variantClasses: Record<string, string> = {
    primary: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400',
    outline:
      'bg-transparent text-black border-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300',
  }

  return [
    baseClasses,
    variantClasses[props.variant] || '',
    props.fullWidth ? 'w-full' : '',
    props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    props.class,
  ].join(' ')
})
</script>
