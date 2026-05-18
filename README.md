# Soccer Stadium Reservation App

A SWE381-style full-stack web application for organizing soccer matches by connecting stadium owners with match organizers.

## What This Project Contains

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

## Beginner Setup: How to Run From Zero

Follow these steps in order. You need **two terminals** open at the same time: one for the backend server and one for the frontend website.

### 1. Install the required programs

Install these first if they are not already on your computer:

1. **Node.js LTS** from <https://nodejs.org/>
   - After installing, open a terminal and check:
     ```bash
     node -v
     npm -v
     ```
2. **MongoDB** using one of these options:
   - Easy local option: install MongoDB Community Server from <https://www.mongodb.com/try/download/community>
   - Cloud option: create a free MongoDB Atlas database at <https://www.mongodb.com/atlas>
3. **Code editor** such as Visual Studio Code.

### 2. Open the project folder

Open a terminal in the project folder. The folder should contain this `README.md` file plus `frontend/` and `backend/` folders.

```bash
cd SWE-381-Project
```

If you are already inside the project folder, you do not need to run the command above.

### 3. Start MongoDB

Choose **one** option.

#### Option A: Local MongoDB

Make sure MongoDB is running on your computer. The default local database URL used by this project is:

```text
mongodb://127.0.0.1:27017/swe381_soccer
```

#### Option B: MongoDB Atlas

Copy your Atlas connection string. It will look similar to this:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.example.mongodb.net/swe381_soccer
```

You will paste it into the backend `.env` file in the next step.

### 4. Run the backend API

Open **Terminal 1** and run:

```bash
cd backend
npm install
```

Create a `.env` file from the example file.

On macOS/Linux/Git Bash:

```bash
cp .env.example .env
```

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Open `backend/.env` and make sure it has these values:

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/swe381_soccer
JWT_SECRET=change_this_secret
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Now start the backend:

```bash
npm run dev
```

You should see messages similar to:

```text
MongoDB connected
Server running on port 5000
```

Keep this terminal open. The backend API runs at:

```text
http://localhost:5000
```

### 5. Run the frontend website

Open **Terminal 2**. Start from the main project folder, then run:

```bash
cd frontend
npm install
npm run dev
```

You should see a local website URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

### 6. How to use the app after it opens

1. Click **Register**.
2. Create a **Stadium owner** account.
3. Sign in as the owner.
4. Open **Owner Dashboard**.
5. Add a stadium with name, location, description, optional photo URLs, and facilities.
6. Add reservation slots for the next 7 days.
7. Sign out.
8. Register another account as **Match organizer**.
9. Search stadiums by location, date, or time.
10. Open a stadium schedule.
11. Reserve an available green slot.
12. Open **Reservations** if you want to view or cancel your reservation.

### 7. Common problems

#### `npm install` fails

Make sure you are inside the correct folder:

```bash
cd backend
npm install
```

or:

```bash
cd frontend
npm install
```

If the error says the npm registry is blocked, try again on a normal internet connection or ask your instructor/lab admin if the network blocks npm downloads.

#### Backend says MongoDB connection failed

Check that MongoDB is running and that `MONGO_URI` in `backend/.env` is correct.

#### Frontend opens but data does not load

Make sure the backend is still running in Terminal 1 at `http://localhost:5000`.

#### Port already in use

If port `5000` is busy, change `PORT` in `backend/.env`. If Vite port `5173` is busy, Vite will usually choose another port and print it in the terminal.

## Developer Setup Summary

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
