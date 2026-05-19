const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const stadiumRoutes = require('./routes/stadiumRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'SWE381 Soccer Reservation API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
