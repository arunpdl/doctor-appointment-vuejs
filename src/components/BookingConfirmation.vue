<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <router-link
      :to="{ name: 'Doctors' }"
      class="inline-flex items-center text-sm mb-6 hover:underline"
    >
      <img :src="BackIcon" alt="Back" class="w-4 h-4 mr-2" />
      Back to home
    </router-link>

    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
        <svg
          class="w-[48px] h-[48px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold">Appointment Confirmed!</h1>
      <p class="text-gray-400 mt-2">Your appointment has been successfully scheduled</p>
    </div>

    <div class="mt-6 py-6 border border-gray-300 rounded-md shadow px-4">
      <div class="">
        <h2 class="font-semibold mb-4">Appointment Details</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-gray-400">Doctor:</div>
            <div class="font-medium">{{ doctorName && decodeURIComponent(doctorName) }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-gray-400">Date:</div>
            <div>{{ formattedDate }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-gray-400">Time:</div>
            <div>{{ time }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-gray-400">Timezone:</div>
            <div class="flex items-center">{{ timezone && decodeURIComponent(timezone) }}</div>
          </div>
        </div>

        <div class="border-t border-gray-300 mt-6 pt-6">
          <p class="text-sm text-gray-400 mb-2">
            Please arrive 15 minutes before your scheduled appointment time.
          </p>
          <p class="text-sm text-gray-400">
            Need to reschedule? Please contact us at least 24 hours in advance.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 space-y-4">
      <BaseButton :fullWidth="true" @click="handleViewAppointments">
        <router-link :to="{ name: 'Appointments' }">View My Appointments</router-link>
      </BaseButton>
      <BaseButton variant="outline" :fullWidth="true" @click="handleGoHome">
        <router-link :to="{ name: 'Doctors' }">Return to Home</router-link>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackIcon from '@/assets/icons/back.svg'
import { formatAppointmentDate } from '@/utils/appointmentHelper'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from './ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const doctorName = computed(() =>
  Array.isArray(route.query.doctor) ? route.query.doctor[0] : route.query.doctor,
)
const date = computed(() =>
  Array.isArray(route.query.date) ? route.query.date[0] : route.query.date,
)
const time = computed(() =>
  Array.isArray(route.query.time) ? route.query.time[0] : route.query.time,
)
const timezone = computed(() =>
  Array.isArray(route.query.timezone) ? route.query.timezone[0] : route.query.timezone,
)
const formattedDate = computed(() => (date.value ? formatAppointmentDate(date.value) : ''))

const handleViewAppointments = () => {
  router.push({
    name: 'Appointments',
  })
}

const handleGoHome = () => {
  router.push({
    name: 'Doctors',
  })
}
</script>
