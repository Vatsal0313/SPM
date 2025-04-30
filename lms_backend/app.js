require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());

const db = require('./routes/connection');

const hostname = `localhost`
const PORT = process.env.PORT || 4000;

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL, // Allow frontend origin
//     credentials: true, // Allow cookies & headers
//   })
// );
//Changes start
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Origin", "https://leadmanagementsystem.vercel.app");
res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization");

if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
//Changes end
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.listen(PORT, () => console.log(`🎯 Server is started on port: http://${hostname}:${PORT}/`));
