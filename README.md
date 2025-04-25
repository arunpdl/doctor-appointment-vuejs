# Doctor Appointment System

This is a simple doctor appointment system built with Vue 3, Pinia and Tailwind CSS.

## Features

- Browse and view doctors list
- See detailed doctor profiles
- Check available appointment slots
- Book appointments with doctors
- View all booked appointments

## Setup & Usage Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- Any package manager

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd appointment-booking-system
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the development server:
   ```sh
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

### Running Tests

Execute unit tests:

```sh
pnpm test:unit
```

## Assumptions & Design Decisions

1. The application uses Pinia store for state management, with data persisting only on local storage.

2. Appointment time slots are predefined and fixed for all doctors.

3. A clean, minimal UI is implemented using Tailwind CSS components for usability.

## Known Limitations & Future Enhancements

### Limitations

- No authentication or user accounts
- No ability to cancel or edit appointments
- Appointments can be duplicated (same doctor/time slot)
- Appointment data is only stored in local storage
- No confirmation emails or reminders

### Future Enhancements

1. **Authentication System**: Implement user accounts and authentication
2. **Appointment Management**: Add editing and cancellation capabilities
3. **Doctor Availability**: Implement custom schedules for each doctor
4. **Data Persistence**: Add backend integration with database storage
5. **Notifications**: Implement email/SMS confirmations and reminders
6. **Filtering/Search**: Add search functionality for doctors by specialty, location, etc.

## Testing

The application includes automated tests using Vitest for unit testing.

- Unit tests for AppointmentList and DoctorCard components
- Store testing for state management
- Unit test for appointment helper function

Run tests with:

```sh
pnpm test:unit
```
