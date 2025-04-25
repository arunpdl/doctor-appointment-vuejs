<template>
  <div class="flex flex-col gap-4 px-2">
    <h1 class="text-3xl mb-8 text-center">My Appointments</h1>

    <div v-if="appointments.length === 0" class="text-center py-12">
      <h2 class="text-xl font-semibold mb-4">No appointments scheduled</h2>
      <p class="text-gray-400 mb-6">You don't have any appointments scheduled yet.</p>
      <BaseButton @click="handleScheduleAppointment"> Schedule an Appointment </BaseButton>
    </div>
    <div v-else class="space-y-8">
      <div v-if="upcomingAppointments.length > 0">
        <h2 class="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AppointmentCard
            v-for="appointment in upcomingAppointments"
            :key="appointment.id"
            :appointment="appointment"
          />
        </div>
      </div>
      <div v-if="pastAppointments.length > 0">
        <h2 class="text-xl font-semibold mb-4">Past Appointments</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AppointmentCard
            v-for="appointment in pastAppointments"
            :key="appointment.id"
            :appointment="appointment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoctorStore } from '@/stores/doctorStore'
import type { SavedAppointment } from '@/types/doctors'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppointmentCard from './ui/AppointmentCard.vue'
import BaseButton from './ui/BaseButton.vue'

const router = useRouter()

const { getBookedAppointments } = useDoctorStore()

const appointments = ref<SavedAppointment[]>([])

const sortedAppointments = computed(() => {
  return [...appointments.value].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
})

const upcomingAppointments = computed(() => {
  return sortedAppointments.value.filter((appointment) => {
    return new Date(appointment?.date) >= new Date()
  })
})

const pastAppointments = computed(() => {
  return sortedAppointments.value.filter((appointment) => {
    return new Date(appointment?.date) < new Date()
  })
})

const handleScheduleAppointment = () => {
  router.push({
    name: 'Doctors',
  })
}

onMounted(() => {
  try {
    appointments.value = getBookedAppointments()
  } catch (error) {
    console.error('Error fetching appointments:', error)
  }
})
</script>
