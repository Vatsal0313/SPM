// require('dotenv').config();
// const cookieParser = require('cookie-parser');
// const express = require('express');
// const app = express();
// const cors = require("cors");
// app.use(express.json());

// const db = require('./routes/connection');

// const hostname = `localhost`
// const PORT = process.env.PORT || 4000;

// app.use(cors({
//   origin: 'https://lead-management-system-beryl.vercel.app', // <-- use your actual frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// }));

// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL, // Allow frontend origin
// //     credentials: true, // Allow cookies & headers
// //   })
// // );
// //Changes start
// // app.use(cors({
// //   origin: (origin, callback) => {
// //     const allowedOrigins = [process.env.FRONTEND_URL];
// //     if (allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true
// // }));

// // app.options("*", cors({
// //   origin: process.env.FRONTEND_URL,
// //   credentials: true
// // }));
// app.options("*", cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200); // 👈 important
//   }

//   next();
// });

// //Changes end
// app.use(cookieParser());

// app.get("/", (req, res) => {
//     res.send("Hello, Express!");
// });

// app.use("/api/auth", require("./routes/authRoutes"));
// app.listen(PORT, () => console.log(`🎯 Server is started on port: http://${hostname}:${PORT}/`));
