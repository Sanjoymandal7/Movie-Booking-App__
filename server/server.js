const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://dino-movies.vercel.app",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/", (req, res) => res.status(200).send({ message: "Node server" }));

const PORT = process.env.PORT || 8027;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
