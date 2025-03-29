export interface DoctorSchedule {
  name: string
  timezone: string
  day_of_week: string
  available_at: string
  available_until: string
}

export interface Doctor {
  name: string
  timezone: string
  schedules: DoctorSchedule[]
}

export interface DateOption {
  value: string
  day: string
  date: string
  dayOfWeek: string
}

export interface Appointment {
  doctor: string
  date: string
  time: string
  timezone: string
}

export interface SavedAppointment extends Appointment {
  id: string
  createdAt: string
}
