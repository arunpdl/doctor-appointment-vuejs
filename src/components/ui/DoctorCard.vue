<template>
  <div
    class="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
  >
    <div class="p-10 border-b border-gray-300">
      <img :src="DoctorAvatar" :alt="doctor.name" class="object-contain w-auto h-auto" />
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex-grow">
        <h2 class="font-semibold text-lg">{{ doctor.name }}</h2>
        <div class="flex items-center gap-1">
          <img :src="GlobeIcon" alt="globe" class="h-3 w-3" />
          <div class="text-sm text-gray-500">Timezone: {{ doctor.timezone }}</div>
        </div>

        <div class="mt-4 space-y-2">
          <h3 class="text-sm font-medium">Available on:</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(day, index) in uniqueDays"
              :key="index"
              class="text-xs bg-gray-200 px-2 py-1 rounded-full"
            >
              {{ day }}
            </div>
          </div>
        </div>
      </div>

      <BaseButton class="mt-4" :fullWidth="true" @click="handleViewAvailability(doctor.name)"
        >View Availability</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import DoctorAvatar from '@/assets/icons/doctor-avatar.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import type { Doctor } from '@/types/doctors'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

const { doctor } = defineProps<{ doctor: Doctor }>()
const router = useRouter()

const uniqueDays = computed(() => {
  return Array.from(new Set(doctor.schedules.map((schedule) => schedule.day_of_week)))
})

const handleViewAvailability = (doctorName: string) => {
  router.push({
    name: 'DoctorDetails',
    params: {
      doctorName,
    },
  })
}
</script>
