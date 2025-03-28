<template>
  <div class="doctor-list">
    <div class="text-3xl text-center">Available Doctors</div>
    <div v-if="isLoading" class="text-2xl">Loading doctors...</div>

    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else class="doctors">
      <div v-for="doctor in doctors" :key="doctor.name" class="doctor-card">
        <h3>{{ doctor.name }}</h3>
        <p class="timezone">Timezone: {{ doctor.timezone }}</p>
        <h4>Available On:</h4>
        <div class="schedules">
          <div v-for="(schedule, index) in doctor.schedules" :key="index">
            <div class="schedule-item">
              {{ schedule.day_of_week }}
            </div>
          </div>
        </div>
        <router-link
          :to="{ name: 'BookAppointment', params: { doctorName: doctor.name } }"
          class="book-btn"
        >
          View Availability
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDoctorStore } from '@/stores/doctorStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const store = useDoctorStore()
const { isLoading, error, doctors } = storeToRefs(store)

onMounted(() => {
  store.fetchAllSchedules()
})
</script>

<style scoped>
.doctors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.doctor-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.doctor-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.doctor-card .timezone {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 10px;
}

.schedules {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.schedule-item {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
  display: inline-block;

  margin-right: 5px;
  margin-bottom: 5px;
}

.book-btn {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
}
</style>
