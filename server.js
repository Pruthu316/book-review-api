require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
