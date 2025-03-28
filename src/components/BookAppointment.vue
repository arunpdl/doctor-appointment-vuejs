<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDoctorStore } from '@/stores/doctorStore'
import type { DateOption, Doctor } from '@/types/doctors'
import DoctorAvatar from '@/assets/doctor-avatar.svg'
import router from '@/router'

const route = useRoute()
const doctorStore = useDoctorStore()
const { getDoctorByName, fetchAllSchedules, getAvailableDates, getAvailableTimeSlots } = doctorStore

const doctorName = computed(() => {
  const name = route.params.doctorName
  return Array.isArray(name) ? name[0] : name
})

const doctor = ref<Doctor | null>(null)
const availableSlots = ref<DateOption[]>([])
const availableTimeSlots = ref<string[]>([])
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)

onMounted(async () => {
  try {
    await fetchAllSchedules()
    const doctorInfo = getDoctorByName(doctorName.value)
    if (doctorInfo) {
      doctor.value = doctorInfo
      availableSlots.value = getAvailableDates(doctorInfo)
    } else {
      throw new Error('Doctor not found')
    }
  } catch (err) {
    console.error('Error fetching schedules:', err)
  }
})

watch(selectedDate, (newDate) => {
  if (newDate && doctor.value) {
    availableTimeSlots.value = getAvailableTimeSlots(doctor.value, newDate)
  }
})

const handleSelectDate = (date: string) => {
  selectedDate.value = date
  selectedTime.value = null
}

const handleSelectTime = (time: string) => {
  selectedTime.value = time
}

const handleBookAppointment = () => {
  if (selectedDate.value && selectedTime.value && doctor.value) {
    router.push({
      name: 'BookingConfirmation',
      query: {
        doctor: doctor.value?.name,
        date: selectedDate.value,
        time: selectedTime.value,
        timezone: doctor.value?.timezone,
      },
    })
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <router-link
      :to="{ name: 'Doctors' }"
      class="inline-flex items-center text-sm mb-6 hover:underline"
    >
      Back to Doctor List
    </router-link>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-1" v-if="doctor">
      <div class="sticky top-8">
        <div class="aspect-square relative mb-4 rounded-lg overflow-hidden">
          <img :src="DoctorAvatar" alt="{{doctor.name}}" class="object-cover w-full h-full" />
        </div>

        <h1 class="text-2xl font-bold mb-2">{{ doctor.name }}</h1>
        <div class="flex items-center text-muted-foreground mb-4">
          <span>{{ doctor.timezone }}</span>
        </div>

        <div class="p-4 bg-muted rounded-lg mb-4">
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
    </div>

    <div class="lg:col-span-2">
      <h2 class="text-xl font-semibold mb-6">Book an Appointment</h2>
      <div class="mb-8">
        <h3 class="text-md font-medium mb-3 flex items-center">Select a Date</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="date in availableSlots"
            :key="date.value"
            :class="`h-auto p-3 justify-start border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedDate === date.value ? 'bg-gray-500 text-white' : ''}`"
            @click="handleSelectDate(date.value)"
          >
            <div class="text-left">
              <div class="text-xs">{{ date.day }}</div>
              <div class="font-semibold">{{ date.date }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8" v-if="selectedDate">
        <h3 class="text-md font-medium mb-3 flex items-center">Select a Time (30-minute slots)</h3>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          v-if="availableTimeSlots.length > 0"
        >
          <div
            v-for="time in availableTimeSlots"
            :key="time"
            :class="`h-auto p-3 justify-start border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedTime === time ? 'bg-gray-500 text-white' : ''}`"
            @click="handleSelectTime(time)"
          >
            {{ time }}
          </div>
        </div>
        <p v-else class="text-muted-foreground">No available time slots for this date.</p>
      </div>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
        @disabled="!selectedDate || !selectedTime"
        @click="handleBookAppointment"
      >
        Book Appointment
      </button>
    </div>
  </div>
</template>

<style scoped></style>
