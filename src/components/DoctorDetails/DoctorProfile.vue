<template>
  <div class="sticky top-8">
    <div class="aspect-square relative mb-4 rounded-lg overflow-hidden border border-gray-300 p-10">
      <img :src="DoctorAvatar" alt="{{doctor.name}}" class="object-cover w-full h-full" />
    </div>

    <h1 class="text-2xl font-bold mb-2">{{ doctor.name }}</h1>
    <div class="flex items-center text-gray-400 mb-4">
      <span><img :src="GlobeIcon" alt="globe" class="h-3 w-3 inline" /> {{ doctor.timezone }}</span>
    </div>

    <div class="p-4 bg-gray-200 rounded-lg mb-4">
      <h3 class="font-medium mb-2">Weekly Schedule</h3>
      <div class="space-y-2">
        <div
          v-for="schedule in doctor.schedules"
          :key="schedule.day_of_week"
          class="grid grid-cols-[100px_1fr] text-sm"
        >
          <div class="font-medium">{{ schedule.day_of_week }}</div>
          <div>{{ schedule.available_at }} - {{ schedule.available_until }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DoctorAvatar from '@/assets/icons/doctor-avatar.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import type { Doctor } from '@/types/doctors'

const { doctor } = defineProps<{ doctor: Doctor }>()
</script>
