require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// route imports
const incomeRoutes = require('./backend/routes/income.routes');
const expenseRoutes = require('./backend/routes/expense.routes');
const transactionsRoutes = require('./backend/routes/transactions.routes');
const analyticsRoutes = require('./backend/routes/analytics.routes');

// routes would be mounted here
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/analytics', analyticsRoutes);

// connect to database then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
