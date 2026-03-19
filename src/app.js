const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const claimRoutes = require("./routes/claim.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Lost and Found API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;