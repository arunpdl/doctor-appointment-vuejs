import { formatAppointmentDate, generateAppointmentId, parseTime } from '@/utils/appointmentHelper'
import { describe, expect, it, vi } from 'vitest'

describe('Appointment Helper Utilities', () => {
  describe('parseTime', () => {
    it('parses AM times correctly', () => {
      const result = parseTime('9:30AM')

      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(9)
      expect(result.getMinutes()).toBe(30)
      expect(result.getSeconds()).toBe(0)
    })

    it('parses PM times correctly', () => {
      const result = parseTime('3:45PM')

      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(15)
      expect(result.getMinutes()).toBe(45)
      expect(result.getSeconds()).toBe(0)
    })

    it('handles 12 AM (midnight) correctly', () => {
      const result = parseTime('12:00AM')

      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
    })

    it('handles 12 PM (noon) correctly', () => {
      const result = parseTime('12:00PM')

      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(12)
      expect(result.getMinutes()).toBe(0)
    })

    it('handles spaces in time strings', () => {
      const result = parseTime('10:15 AM')

      expect(result).toBeInstanceOf(Date)
      expect(result.getHours()).toBe(10)
      expect(result.getMinutes()).toBe(15)
    })
  })

  describe('generateAppointmentId', () => {
    it('generates a non-empty string ID', () => {
      const id = generateAppointmentId()

      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('generates unique IDs', () => {
      const id1 = generateAppointmentId()
      const id2 = generateAppointmentId()

      expect(id1).not.toBe(id2)
    })
  })

  describe('formatAppointmentDate', () => {
    it('formats dates in a human-readable format', () => {
      const mockDate = new Date(2023, 5, 15)
      vi.setSystemTime(mockDate)

      const result = formatAppointmentDate('2023-06-15')

      expect(result).toContain('June 15, 2023')

      vi.useRealTimers()
    })

    it('handles different date formats', () => {
      const result = formatAppointmentDate('2023/12/25')

      expect(result).toContain('December 25, 2023')
    })
  })
})
