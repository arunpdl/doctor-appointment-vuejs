import DoctorCard from '@/components/ui/DoctorCard.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/doctors/:doctorName',
      name: 'DoctorDetails',
      component: {},
    },
  ],
})

describe('DoctorCard Component', () => {
  it('renders doctor information correctly', () => {
    const doctor = {
      name: 'Dr. John Smith',
      timezone: 'Europe/London',
      schedules: [
        {
          name: 'Dr. John Smith',
          timezone: 'Europe/London',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
      ],
    }

    const wrapper = mount(DoctorCard, {
      props: {
        doctor,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Dr. John Smith')
    expect(wrapper.text()).toContain('Europe/London')
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('View Availability')
  })

  it('navigates to doctor details when button is clicked', async () => {
    const doctor = {
      name: 'Dr. John Smith',
      timezone: 'Europe/London',
      schedules: [],
    }

    router.push = vi.fn()

    const wrapper = mount(DoctorCard, {
      props: {
        doctor,
      },
      global: {
        plugins: [router],
      },
    })

    await wrapper.find('button').trigger('click')

    expect(router.push).toHaveBeenCalledWith({
      name: 'DoctorDetails',
      params: { doctorName: doctor.name },
    })
  })

  it('displays schedule information correctly', () => {
    const doctor = {
      name: 'Dr. Jane Doe',
      timezone: 'America/New_York',
      schedules: [
        {
          name: 'Dr. Jane Doe',
          timezone: 'America/New_York',
          day_of_week: 'Monday',
          available_at: '8:00AM',
          available_until: '4:00PM',
        },
        {
          name: 'Dr. Jane Doe',
          timezone: 'America/New_York',
          day_of_week: 'Wednesday',
          available_at: '8:00AM',
          available_until: '4:00PM',
        },
        {
          name: 'Dr. Jane Doe',
          timezone: 'America/New_York',
          day_of_week: 'Friday',
          available_at: '8:00AM',
          available_until: '4:00PM',
        },
      ],
    }

    const wrapper = mount(DoctorCard, {
      props: {
        doctor,
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Monday')
    expect(wrapper.text()).toContain('Wednesday')
    expect(wrapper.text()).toContain('Friday')
  })
})
