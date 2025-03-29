<template>
  <div class="max-w-prose p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="mb-2 text-2xl font-semibold tracking-tight">{{ appointment.doctor }}</div>
    <div class="mb-3 text-sm text-gray-500 flex gap-1 items-center">
      <img :src="GlobeIcon" class="size-4" alt="calendar" />
      <div>{{ appointment.timezone }}</div>
    </div>
    <div class="flex flex-wrap gap-4 font-normal">
      <div class="flex items-center gap-1">
        <img :src="CalendarIcon" class="size-4" alt="calendar" />
        <div>{{ formatAppointmentDate(appointment.date) }}</div>
      </div>
      <div class="flex items-center gap-1">
        <img :src="ClockIcon" class="size-4" alt="clock" />
        <div>{{ appointment.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '@/assets/icons/calendar.svg'
import ClockIcon from '@/assets/icons/clock.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import type { SavedAppointment } from '@/types/doctors'
import { formatAppointmentDate } from '@/utils/appointmentHelper'

const { appointment } = defineProps<{ appointment: SavedAppointment }>()
</script>
