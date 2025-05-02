require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ CORS Setup
const allowedOrigins = [
  'https://leadmanagementsystem-git-main-vatsals-projects-d11e392c.vercel.app/',
  'https://leadmanagementsystem.vercel.app/',
  'https://leadmanagementsystem-vatsals-projects-d11e392c.vercel.app/',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Global Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Extra CORS headers fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ DB Connection
require(path.join(__dirname, '../routes/connection'));

// ✅ Routes
const authRoutes = require(path.join(__dirname, '../routes/authRoutes'));
app.use("/api/auth", authRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("Hello, Express on Vercel!");
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;
