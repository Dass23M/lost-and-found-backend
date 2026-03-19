const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const claimRoutes = require("./routes/claim.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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