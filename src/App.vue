<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from '@/components/Navbar/TopNavbar.vue'
</script>

<template>
  <div class="container mx-auto px-2 py-4">
    <TopNavBar />
    <RouterView />
  </div>
</template>

<style></style>
