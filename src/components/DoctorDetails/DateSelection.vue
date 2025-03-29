<template>
  <div class="mb-8">
    <h3 class="text-md font-medium mb-3 flex items-center">
      <img :src="CalendarIcon" alt="Calendar" class="w-5 h-5 mr-2" />
      Select a Date
    </h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div
        v-for="date in availableSlots"
        :key="date.value"
        :class="`h-auto p-3 justify-start border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition ease-in-out ${selectedDate === date.value ? 'bg-gray-500 text-white' : ''}`"
        @click="handleSelectDate(date.value)"
      >
        <div class="text-left">
          <div class="text-xs">{{ date.day }}</div>
          <div class="font-semibold">{{ date.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '@/assets/icons/calendar.svg'
import type { DateOption } from '@/types/doctors'

const { availableSlots, selectedDate, handleSelectDate } = defineProps<{
  availableSlots: DateOption[]
  selectedDate: string | null
  handleSelectDate: (date: string) => void
}>()
</script>
