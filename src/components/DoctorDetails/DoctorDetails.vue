<script setup lang="ts">
import BackIcon from '@/assets/icons/back.svg'
import DoctorProfile from '@/components/DoctorDetails/DoctorProfile.vue'
import router from '@/router'
import { useDoctorStore } from '@/stores/doctorStore'
import type { DateOption, Doctor } from '@/types/doctors'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '../ui/BaseButton.vue'
import SpinnerComponent from '../ui/SpinnerComponent.vue'
import DateSelection from './DateSelection.vue'
import TimeSlotSelection from './TimeSlotSelection.vue'

const route = useRoute()
const doctorStore = useDoctorStore()
const {
  getDoctorByName,
  fetchAllSchedules,
  getAvailableDates,
  getAvailableTimeSlots,
  bookAppointment,
} = doctorStore
const { isLoading, error } = storeToRefs(doctorStore)

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
    bookAppointment({
      doctor: doctor.value.name,
      date: selectedDate.value,
      time: selectedTime.value,
      timezone: doctor.value.timezone,
    })

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
  <div class="container mx-auto px-2 py-2">
    <router-link
      :to="{ name: 'Doctors' }"
      class="inline-flex items-center text-normal mb-6 hover:underline"
    >
      <img :src="BackIcon" alt="Back" class="w-4 h-4 mr-2" />
      Back to Doctor List
    </router-link>
  </div>
  <SpinnerComponent v-if="isLoading" size="large" />

  <div v-else-if="error" class="text-center py-8 text-red-500">
    <p>There was an error loading the doctor detail. {{ error }}</p>
    <BaseButton variant="secondary" class="mt-4" @click="fetchAllSchedules()">Try Again</BaseButton>
  </div>

  <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-1" v-if="doctor">
      <DoctorProfile :doctor="doctor" />
    </div>

    <div class="lg:col-span-2">
      <h2 class="text-xl font-semibold mb-6">Book an Appointment</h2>
      <DateSelection
        :availableSlots="availableSlots"
        :selectedDate="selectedDate"
        :handleSelectDate="handleSelectDate"
      />

      <TimeSlotSelection
        v-if="selectedDate"
        :availableTimeSlots="availableTimeSlots"
        :selectedTime="selectedTime"
        :handleSelectTime="handleSelectTime"
      />
      <BaseButton
        :disabled="!selectedDate || !selectedTime"
        @click="handleBookAppointment"
        :fullWidth="true"
      >
        Book Appointment
      </BaseButton>
    </div>
  </div>
</template>
