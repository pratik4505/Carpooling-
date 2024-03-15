require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const Database = require("./config/database");
const PORT = process.env.PORT || 4000;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.gkxxxeg.mongodb.net/carPoolingDatabase?retryWrites=true&w=majority&appName=Cluster1`;
const db = new Database(MONGODB_URI);
const socketIo = require("./socket");
const rideRoutes = require("./routes/rideRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { paymentWebhook } = require("./controllers/paymentController");
const bodyParser = require("body-parser");
db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);
app.post(
  "/payment/confirmPaymentWebhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);
app.use("/payment", paymentRoutes);

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

const server = app.listen(PORT, () =>
  console.log(`Server up and running on port ${PORT}!`)
);

socketIo.runIO(socketIo.init(server));
