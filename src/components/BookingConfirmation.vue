<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <router-link
      :to="{ name: 'Doctors' }"
      class="inline-flex items-center text-sm mb-6 hover:underline"
    >
      Back to home
    </router-link>

    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <!-- <CheckCircle2 class="w-8 h-8 text-green-600" /> -->
      </div>
      <h1 class="text-2xl font-bold">Appointment Confirmed!</h1>
      <p class="text-muted-foreground mt-2">Your appointment has been successfully scheduled</p>
    </div>

    <div class="border-t mt-6 pt-6">
      <div class="pt-6">
        <h2 class="font-semibold mb-4">Appointment Details</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-muted-foreground">Doctor:</div>
            <div class="font-medium">{{ doctorName && decodeURIComponent(doctorName) }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-muted-foreground">Date:</div>
            <div>{{ formattedDate }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-muted-foreground">Time:</div>
            <div>{{ time }}</div>
          </div>

          <div class="grid grid-cols-[100px_1fr] gap-2">
            <div class="text-muted-foreground">Timezone:</div>
            <div class="flex items-center">{{ timezone && decodeURIComponent(timezone) }}</div>
          </div>
        </div>

        <div class="border-t mt-6 pt-6">
          <p class="text-sm text-muted-foreground mb-2">
            Please arrive 15 minutes before your scheduled appointment time.
          </p>
          <p class="text-sm text-muted-foreground">
            Need to reschedule? Please contact us at least 24 hours in advance.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 space-y-4">
      <button class="w-full">
        <router-link :to="{ name: 'Doctors' }">View My Appointments</router-link>
      </button>
      <button class="w-full">
        <router-link :to="{ name: 'Doctors' }">Return to Home</router-link>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const doctorName = Array.isArray(route.query.doctorName)
  ? route.query.doctorName[0]
  : route.query.doctorName
const date = Array.isArray(route.query.date) ? route.query.date[0] : route.query.date
const time = Array.isArray(route.query.time) ? route.query.time[0] : route.query.time
const timezone = Array.isArray(route.query.timezone)
  ? route.query.timezone[0]
  : route.query.timezone

const formattedDate = date
  ? new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  : ''
</script>
