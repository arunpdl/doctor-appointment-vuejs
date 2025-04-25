import { useDoctorStore } from '@/stores/doctorStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('localStorage', () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}))

const mockFetchResponse: Partial<Response> = {
  ok: true,
  json: () =>
    Promise.resolve([
      {
        name: 'Dr. John Smith',
        timezone: 'Europe/London',
        day_of_week: 'Monday',
        available_at: '9:00AM',
        available_until: '5:00PM',
      },
      {
        name: 'Dr. John Smith',
        timezone: 'Europe/London',
        day_of_week: 'Tuesday',
        available_at: '9:00AM',
        available_until: '5:00PM',
      },
      {
        name: 'Dr. Jane Doe',
        timezone: 'America/New_York',
        day_of_week: 'Monday',
        available_at: '8:00AM',
        available_until: '4:00PM',
      },
    ]),
}

global.fetch = global.fetch = vi.fn().mockImplementation(() => Promise.resolve(mockFetchResponse))

describe('Doctor Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.getItem = vi.fn().mockReturnValue('[]')
  })

  it('fetches doctor schedules successfully', async () => {
    const store = useDoctorStore()
    await store.fetchAllSchedules()
    expect(global.fetch).toHaveBeenCalledWith(expect.any(String))
    expect(store.schedules.length).toBe(3)
    expect(store.error).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('computes doctor list correctly from schedules', async () => {
    const store = useDoctorStore()
    await store.fetchAllSchedules()
    expect(store.doctors.length).toBe(2)
    expect(store.doctors[0].name).toBe('Dr. John Smith')
    expect(store.doctors[0].schedules.length).toBe(2)
    expect(store.doctors[1].name).toBe('Dr. Jane Doe')
    expect(store.doctors[1].schedules.length).toBe(1)
  })

  it('finds a doctor by name', async () => {
    const store = useDoctorStore()
    await store.fetchAllSchedules()

    const doctor = store.getDoctorByName('Dr. Jane Doe')
    expect(doctor).toBeDefined()
    expect(doctor?.name).toBe('Dr. Jane Doe')
    expect(doctor?.timezone).toBe('America/New_York')

    const nonExistentDoctor = store.getDoctorByName('Dr. Nobody')
    expect(nonExistentDoctor).toBeUndefined()
  })

  it('gets available dates for a doctor', async () => {
    const store = useDoctorStore()
    await store.fetchAllSchedules()

    const doctor = store.doctors[0]
    const availableDates = store.getAvailableDates(doctor)

    expect(Array.isArray(availableDates)).toBe(true)
    if (availableDates.length > 0) {
      expect(availableDates[0]).toHaveProperty('value')
      expect(availableDates[0]).toHaveProperty('day')
      expect(availableDates[0]).toHaveProperty('date')
      expect(availableDates[0]).toHaveProperty('dayOfWeek')
    }
  })

  it('gets available time slots for a doctor on a specific date', async () => {
    const store = useDoctorStore()
    await store.fetchAllSchedules()

    const doctor = store.doctors[0]

    const date = '2023-06-05'
    const timeSlots = store.getAvailableTimeSlots(doctor, date)

    expect(Array.isArray(timeSlots)).toBe(true)
    expect(timeSlots.length).toBeGreaterThan(0)
    expect(timeSlots).toContain('9:00 AM')
    expect(timeSlots).toContain('4:30 PM')
  })

  it('books an appointment successfully', () => {
    vi.clearAllMocks()

    const setItemMock = vi.fn()
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('[]'),
        setItem: setItemMock,
      },
      writable: true,
    })

    const store = useDoctorStore()

    const appointment = {
      doctor: 'Dr. John Smith',
      date: '2023-06-05',
      time: '10:00 AM',
      timezone: 'Europe/London',
    }

    vi.mock('@/utils/appointmentHelper', () => ({
      generateAppointmentId: () => 'test-id-123',
    }))

    const savedAppointment = store.bookAppointment(appointment)

    expect(setItemMock).toHaveBeenCalled()
    expect(setItemMock.mock.calls[0][0]).toBe('appointments')
    expect(setItemMock.mock.calls[0][1]).toContain('Dr. John Smith')

    expect(savedAppointment).toMatchObject({
      ...appointment,
      id: expect.any(String),
      createdAt: expect.any(String),
    })
  })

  it('retrieves booked appointments', () => {
    const mockAppointments = [
      {
        id: 'test-id-1',
        doctor: 'Dr. John Smith',
        date: '2023-06-05',
        time: '10:00 AM',
        timezone: 'Europe/London',
        createdAt: '2023-06-01T10:00:00.000Z',
      },
    ]

    localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockAppointments))

    const store = useDoctorStore()
    const appointments = store.getBookedAppointments()

    expect(localStorage.getItem).toHaveBeenCalledWith('appointments')
    expect(appointments).toEqual(mockAppointments)
  })

  it('handles empty appointments list', () => {
    localStorage.getItem = vi.fn().mockReturnValue(null)

    const store = useDoctorStore()
    const appointments = store.getBookedAppointments()

    expect(appointments).toEqual([])
  })

  it('handles API fetch errors gracefully', async () => {
    const errorMessage = 'Network error'
    global.fetch = vi.fn(() => Promise.reject(new Error(errorMessage)))

    const store = useDoctorStore()
    await store.fetchAllSchedules()
    expect(store.error).toBe(errorMessage)
    expect(store.isLoading).toBe(false)
  })

  it('handles empty schedules', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response),
    )

    const store = useDoctorStore()
    await store.fetchAllSchedules()

    expect(store.schedules.length).toBe(0)
    expect(store.doctors.length).toBe(0)
    expect(store.error).toBeNull()
  })

  it('handles non-existent doctor when getting available dates', () => {
    const store = useDoctorStore()

    const emptyDoctor = { name: '', timezone: '', schedules: [] }

    const dates = store.getAvailableDates(emptyDoctor)
    expect(dates).toEqual([])
  })

  it('handles invalid date string when getting time slots', () => {
    const store = useDoctorStore()
    store.schedules = [
      {
        name: 'Dr. Test',
        timezone: 'UTC',
        day_of_week: 'Monday',
        available_at: '9:00AM',
        available_until: '5:00PM',
      },
    ]

    const doctor = store.doctors[0]

    expect(store.getAvailableTimeSlots(doctor, 'invalid-date')).toEqual([])
    expect(store.getAvailableTimeSlots(doctor, '2023/13/45')).toEqual([])
    expect(store.getAvailableTimeSlots(doctor, '')).toEqual([])
  })

  it('allows duplicate bookings (current limitation)', () => {
    const store = useDoctorStore()

    const initialAppointments = [
      {
        id: 'existing-id',
        doctor: 'Dr. Popular',
        date: '2023-06-05',
        time: '10:00 AM',
        timezone: 'UTC',
        createdAt: '2023-06-01T00:00:00.000Z',
      },
    ]

    localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(initialAppointments))

    const duplicateAppointment = {
      doctor: 'Dr. Popular',
      date: '2023-06-05',
      time: '10:00 AM',
      timezone: 'UTC',
    }

    const result = store.bookAppointment(duplicateAppointment)
    expect(result.doctor).toBe('Dr. Popular')
    expect(result.date).toBe('2023-06-05')
    expect(result.time).toBe('10:00 AM')
  })
})
