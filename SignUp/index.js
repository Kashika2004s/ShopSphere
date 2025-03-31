const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Import Routes
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const profileRouter = require("./routes/profile");
const productsRouter = require("./routes/products");
const editRouter = require("./routes/edit");
const deleteRouter = require("./routes/delete");
const wishlistRouter = require("./routes/wishlist");
const cartRouter = require("./routes/cart");
const orderRoutes = require("./routes/order");
const orderhistoryRoutes = require("./routes/orderhistory");
const bestProductRouter = require("./routes/bestProduct");
const verifyRouter = require("./routes/verify");

const errorHandler = require("./Middlewares/errorHandler");
const searchRouter = require("./routes/search");
const alternativeRouter = require("./routes/alternative");
const authenticateToken = require("./Middlewares/tokenAuthentication");
const feedbackRouter = require("./routes/feedback");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection using URI from .env file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB Connection Error:", error.message));

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173', // Localhost for development
    'https://eco-conscious-brown.vercel.app', // Production URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Eco-Conscious API");
});
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/products", authenticateToken, productsRouter);
app.use("/api/edit", authenticateToken, editRouter);
app.use("/api/delete", authenticateToken, deleteRouter);
app.use("/api/wishlist", authenticateToken, wishlistRouter);
app.use("/api/cart", authenticateToken, cartRouter);
app.use("/api/order", authenticateToken, orderRoutes);
app.use("/api/search", searchRouter);
app.use("/api/alternatives", alternativeRouter);
app.use("/api/order-history", authenticateToken, orderhistoryRoutes);
app.use("/api/bestproduct", authenticateToken, bestProductRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/verify", verifyRouter);

// Error handling middleware
app.use(errorHandler);

// Update the port binding to use the dynamic environment port.
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`)
);
