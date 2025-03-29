import DoctorsView from '@/views/DoctorsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Doctors',
      component: DoctorsView,
    },
    {
      path: '/doctor/:doctorName',
      name: 'DoctorDetails',
      component: () => import('@/views/DoctorDetailsView.vue'),
    },
    {
      path: '/booking-confirmation',
      name: 'BookingConfirmation',
      component: () => import('@/views/BookingConfirmationView.vue'),
    },
    {
      path: '/my-appointments',
      name: 'Appointments',
      component: () => import('@/views/AppointmentListView.vue'),
    },
  ],
})

export default router
