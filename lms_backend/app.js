require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());

const db = require('./routes/connection');

const hostname = `localhost`
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow frontend origin
    credentials: true, // Allow cookies & headers
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.listen(PORT, () => console.log(`🎯 Server is started on port: http://${hostname}:${PORT}/`));