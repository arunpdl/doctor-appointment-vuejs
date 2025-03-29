<template>
  <header class="shadow-sm">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <router-link :to="{ name: 'Doctors' }" class="hidden md:block font-bold text-xl">
        Appointment Scheduler
      </router-link>

      <router-link :to="{ name: 'Doctors' }" class="md:hidden font-bold text-xl"> AS </router-link>

      <nav class="flex items-center gap-6">
        <router-link
          :to="{ name: 'Appointments' }"
          class="flex items-center gap-1 transition-colors duration-200 ease-in-out hover:text-gray-500"
          active-class="text-gray-500"
        >
          <img :src="CalendarIcon" alt="Calendar Icon" class="w-4 h-4" />
          <div class="hidden md:block">My Appointments</div>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import CalendarIcon from '@/assets/icons/calendar.svg'
</script>
