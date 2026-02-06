# Class Booking System

A MERN stack web application for scheduling class bookings with monthly batches using FullCalendar React.

## Features

- **User Authentication**: JWT-based login/signup
- **3 Monthly Batches**: Each with 7 days of classes
- **Slot Selection**: Interactive calendar with FullCalendar
- **Booking Management**: View, add, and delete bookings
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React, Vite, FullCalendar, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd class-booking-system
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Configure environment variables:
   - Edit `backend/.env` with your MongoDB connection string
   ```
   MONGODB_URI=mongodb://localhost:27017/class-booking
   JWT_SECRET=your-secret-key
   ```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
class-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Booking.js         # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── bookingRoutes.js   # Booking endpoints
│   ├── utils/
│   │   └── batchUtils.js      # Batch generation
│   └── server.js              # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar/
│   │   │   │   ├── SlotCalendar.jsx
│   │   │   │   └── MonthlySchedule.jsx
│   │   │   └── Modal/
│   │   │       └── SelectedSlotsModal.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   └── ScheduledClassesPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── batchUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get user's bookings |
| GET | `/api/bookings/grouped` | Get bookings grouped by month |
| POST | `/api/bookings` | Create new bookings |
| DELETE | `/api/bookings/:id` | Delete a booking |
| GET | `/api/bookings/batches/:year/:month` | Get batch schedule |

## Business Logic

- **Batch 1**: Starts on 1st of every month
- **Classes**: 7 days per batch, skipping Sundays
- **Gap**: 2 days between batches (excluding Sundays)
- **Topics**: 7 different topics per batch (Topic 1-7)

## User Flow

1. **New User**: Login → Calendar Page → Select Slots → Submit → Scheduled Page
2. **Returning User with Bookings**: Login → Scheduled Page
3. **Add New Slot**: Scheduled Page → "Add New Slot" → Calendar Page

## License

ISC
