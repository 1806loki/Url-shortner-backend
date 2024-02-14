const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDb = require("./config/connectDb");
const urlRouter = require("./routes/urlRoute");
const userRoutes = require("./routes/userRoute");
const authenticateToken = require("./config/authMiddleware");

const server = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

connectDb();

const PORT = 3000;

server.use("/api", urlRouter);

server.use("/api/users", userRoutes);

server.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
