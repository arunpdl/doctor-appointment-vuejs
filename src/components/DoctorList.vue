<template>
  <div class="flex flex-col gap-8">
    <div class="text-3xl mb-8 text-center">Available Doctors</div>
    <SpinnerComponent v-if="isLoading" size="large" />

    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>There was an error loading the doctors list. {{ error }}</p>
      <BaseButton variant="secondary" class="mt-4" @click="fetchAllSchedules()"
        >Try Again</BaseButton
      >
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DoctorCard v-for="doctor in doctors" :key="doctor.name" :doctor="doctor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoctorStore } from '@/stores/doctorStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import DoctorCard from './ui/DoctorCard.vue'
import SpinnerComponent from './ui/SpinnerComponent.vue'

const store = useDoctorStore()
const { fetchAllSchedules } = store
const { isLoading, error, doctors } = storeToRefs(store)

onMounted(() => {
  fetchAllSchedules()
})
</script>
