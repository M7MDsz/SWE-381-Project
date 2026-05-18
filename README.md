# Soccer Stadium Reservation App

A SWE381-style full-stack web application for organizing soccer matches by connecting stadium owners with match organizers.

## Structure

```text
frontend/
  src/
    context/
    pages/
    components/
backend/
  controllers/
  routes/
  models/
  middleware/
```

## Features

- JWT authentication for stadium owners and users.
- Stadium owners can add stadiums, create reservation slots for the upcoming 7 days, view slot status, exchange messages, and view reservation statistics.
- Users can search stadiums by location and available time, view schedules, reserve available slots, cancel reservations, and exchange messages with owners.

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with a valid MongoDB connection string.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:5000/api` by default. You can change it with `VITE_API_URL`.
