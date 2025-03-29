import type {
  Appointment,
  DateOption,
  Doctor,
  DoctorSchedule,
  SavedAppointment,
} from '@/types/doctors'
import { generateAppointmentId } from '@/utils/appointmentHelper'
import { addDays, format, isAfter, isBefore, isEqual, parse } from 'date-fns'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const API_URL = 'https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json'

export const useDoctorStore = defineStore('doctors', () => {
  const schedules = ref<DoctorSchedule[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const doctors = computed(() => {
    if (!schedules.value || schedules.value.length === 0) return []

    const doctorMap = new Map<string, Doctor>()

    schedules.value.forEach((schedule) => {
      if (!doctorMap.has(schedule.name)) {
        doctorMap.set(schedule.name, {
          name: schedule.name,
          timezone: schedule.timezone,
          schedules: [],
        })
      }

      doctorMap.get(schedule.name)?.schedules.push(schedule)
    })

    const result = Array.from(doctorMap.values())
    return result
  })

  function getDoctorByName(name: string): Doctor | undefined {
    return doctors.value.find((doctor) => doctor.name === name)
  }

  async function fetchAllSchedules() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      schedules.value = data
    } catch (err) {
      error.value = (err as Error).message
      console.error('Error fetching schedules:', err)
    } finally {
      isLoading.value = false
    }
  }

  function getAvailableDates(doctor: Doctor): DateOption[] {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const shortDays = days.map((day) => day.slice(0, 3))
    const result: DateOption[] = []

    const availableDays = doctor.schedules.map((s) => s.day_of_week)

    // For coming 14 days
    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i)
      const dayOfWeek = days[date.getDay()]

      if (availableDays.includes(dayOfWeek)) {
        result.push({
          value: format(date, 'yyyy-MM-dd'),
          day: shortDays[date.getDay()],
          date: format(date, 'd MMM'),
          dayOfWeek,
        })
      }
    }

    return result
  }

  function getAvailableTimeSlots(doctor: Doctor, dateString: string): string[] {
    const date = new Date(dateString)
    const dayOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][date.getDay()]

    const daySchedule = doctor.schedules.find((s) => s.day_of_week === dayOfWeek)

    if (!daySchedule) return []

    const startTime = parse(daySchedule.available_at.trim(), 'h:mma', new Date())
    const endTime = parse(daySchedule.available_until.trim(), 'h:mma', new Date())

    const slots: string[] = []
    let currentTime = new Date(startTime)

    while (isBefore(currentTime, endTime) || isEqual(currentTime, endTime)) {
      slots.push(format(currentTime, 'h:mm a'))

      currentTime = new Date(currentTime.getTime() + 30 * 60000)

      if (isAfter(currentTime, endTime)) break
    }

    return slots
  }

  function bookAppointment(slot: Appointment): SavedAppointment {
    const bookedAppointments: Appointment[] = getBookedAppointments()

    const newAppointment = {
      ...slot,
      id: generateAppointmentId(),
      createdAt: new Date().toISOString(),
    }
    const updatedAppointments = [...bookedAppointments, newAppointment]
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))

    return newAppointment
  }

  function getBookedAppointments(): SavedAppointment[] {
    return JSON.parse(localStorage.getItem('appointments') || '[]')
  }

  return {
    doctors,
    isLoading,
    error,
    schedules,
    fetchAllSchedules,
    getAvailableDates,
    getAvailableTimeSlots,
    bookAppointment,
    getBookedAppointments,
    getDoctorByName,
  }
})
