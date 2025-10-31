const express = require("express")
const cors = require("cors")
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const config = require('./config/env');
const app = express()
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const verifyToken = require('./middleware/authMiddleware');
app.use(cors({ origin: '*', credentials: false }))

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', verifyToken, productRoutes);
//check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;