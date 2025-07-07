const express = require('express');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/ErrorServer');
const routeNotFound = require('./middlewares/RoutesNotFound');
const corsConfig = require('./config/cors');

const app = express();

// Middleware de configuration CORS
// This allows cross-origin requests from the frontend
app.use(corsConfig);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Middlewares d'erreurs
app.use(errorMiddleware); //server error handler
app.use(routeNotFound); //route not found handler

module.exports = app;