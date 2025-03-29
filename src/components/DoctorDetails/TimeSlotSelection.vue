<template>
  <div class="mb-8">
    <h3 class="text-md font-medium mb-3 flex items-center">
      <img :src="ClockIcon" alt="Clock" class="w-5 h-5 mr-2" />
      Select a Time (30-minute slots)
    </h3>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      v-if="availableTimeSlots.length > 0"
    >
      <div
        v-for="time in availableTimeSlots"
        :key="time"
        :class="`h-auto p-3 justify-start border border-gray-200 rounded-lg transition ease-in-out ${selectedTime === time ? 'bg-gray-500 text-white' : ''} ${isPastTime(time) ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer'}`"
        @click="onSelectTime(time)"
        @disabled="isPastTime(time)"
      >
        {{ time }}
      </div>
    </div>
    <p v-else class="text-gray-400">No available time slots for this date.</p>
  </div>
</template>

<script setup lang="ts">
import ClockIcon from '@/assets/icons/clock.svg'

const { availableTimeSlots, selectedTime, handleSelectTime, selectedDate } = defineProps<{
  availableTimeSlots: string[]
  selectedTime: string | null
  selectedDate: string | null
  handleSelectTime: (time: string) => void
}>()

const onSelectTime = (time: string) => {
  if (isPastTime(time)) return
  handleSelectTime(time)
}

const isPastTime = (time: string) => {
  if (!selectedDate || !time) return false
  const selectedDateTime = new Date(`${selectedDate} ${time}`)
  return selectedDateTime < new Date()
}
</script>
