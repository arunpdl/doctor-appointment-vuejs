import AppointmentList from '@/components/AppointmentList.vue'
import { useDoctorStore } from '@/stores/doctorStore'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Doctors',
      component: {},
    },
  ],
})

vi.mock('@/stores/doctorStore', () => ({
  useDoctorStore: vi.fn(() => ({
    getBookedAppointments: vi.fn(),
  })),
}))

describe('AppointmentList Component', () => {
  let getBookedAppointmentsMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    getBookedAppointmentsMock = vi.fn()
    useDoctorStore.mockReturnValue({
      getBookedAppointments: getBookedAppointmentsMock,
    })

    router.push = vi.fn()
  })

  it('displays empty state when no appointments exist', () => {
    getBookedAppointmentsMock.mockReturnValue([])

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
          // BaseButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No appointments scheduled')
    expect(wrapper.text()).toContain("You don't have any appointments scheduled yet")

    const button = wrapper.findComponent({
      name: 'BaseButton',
    })
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Schedule an Appointment')
  })

  it('navigates to doctors page when schedule button is clicked', async () => {
    getBookedAppointmentsMock.mockReturnValue([])

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'Doctors',
    })
  })

  it('displays upcoming and past appointments correctly', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const mockAppointments = [
      {
        id: 'future-1',
        doctor: 'Dr. Future',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00 AM',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'past-1',
        doctor: 'Dr. Past',
        date: yesterday.toISOString().split('T')[0],
        time: '2:00 PM',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
      },
    ]

    getBookedAppointmentsMock.mockReturnValue(mockAppointments)

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Upcoming Appointments')
    expect(wrapper.text()).toContain('Past Appointments')

    const appointmentCards = wrapper.findAllComponents({ name: 'AppointmentCard' })
    expect(appointmentCards.length).toBe(2)
  })

  // EDGE CASES

  it('handles appointments with invalid dates', () => {
    const mockAppointments = [
      {
        id: 'invalid-1',
        doctor: 'Dr. Invalid',
        date: 'not-a-date',
        time: '10:00 AM',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'invalid-2',
        doctor: 'Dr. Empty',
        date: '',
        time: '2:00 PM',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
      },
    ]

    getBookedAppointmentsMock.mockReturnValue(mockAppointments)

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
          BaseButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No appointments scheduled')
  })

  it('handles errors from getBookedAppointments', () => {
    getBookedAppointmentsMock.mockImplementation(() => {
      throw new Error('Failed to load appointments')
    })

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
          BaseButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No appointments scheduled')
  })

  it('handles empty appointments array with undefined values', () => {
    getBookedAppointmentsMock.mockReturnValue([undefined, null])

    const wrapper = mount(AppointmentList, {
      global: {
        plugins: [router],
        stubs: {
          AppointmentCard: true,
          BaseButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No appointments scheduled')
  })
})
