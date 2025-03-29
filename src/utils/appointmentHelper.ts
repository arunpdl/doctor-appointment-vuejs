export function parseTime(timeStr: string) {
  const cleanedTime = timeStr.trim()
  const time = cleanedTime.slice(0, -2)
  const period = cleanedTime.slice(-2)
  const [hours, minutes] = time.split(':').map(Number)

  const date = new Date()

  let updatedHours = hours

  if (period === 'PM' && hours !== 12) {
    updatedHours += 12
  } else if (period === 'AM' && hours === 12) {
    updatedHours = 0
  }
  date.setHours(updatedHours)
  date.setMinutes(minutes)
  date.setSeconds(0)

  return date
}

export function generateAppointmentId() {
  return Math.random().toString(36).slice(2)
}

export function formatAppointmentDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
