<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavBar from '@/components/Navbar/TopNavbar.vue'
</script>

<template>
  <TopNavBar />
  <div class="container mx-auto px-2 py-8">
    <RouterView />
  </div>
</template>

<style></style>
