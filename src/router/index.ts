import BookAppointmentView from '@/views/BookAppointmentView.vue'
import BookingConfirmationView from '@/views/BookingConfirmationView.vue'
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
      path: '/book/:doctorName',
      name: 'BookAppointment',
      component: BookAppointmentView,
    },
    {
      path: '/booking-confirmation',
      name: 'BookingConfirmation',
      component: BookingConfirmationView,
    },
  ],
})

export default router
