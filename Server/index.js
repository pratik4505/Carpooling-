require("dotenv").config();
const path = require("path");
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
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { paymentWebhook } = require("./controllers/paymentController");
const bodyParser = require("body-parser");
const upload = require("./middleware/fileUpload");
const cron = require("node-cron");
const { getTransactions } = require("./controllers/transactions");
db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);
app.use("/public", express.static(path.join(__dirname, "public")));
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
app.use(upload);
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);
app.use("/transactions", transactionRoutes);
app.use("/payment", paymentRoutes);
app.use("/user", userRoutes);
app.use("/notification", notificationRoutes);
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});
// cron.schedule('*/10 * * * *', cleanUpFunction);
const server = app.listen(PORT, () =>
  console.log(`Server up and running on port ${PORT}!`)
);

socketIo.runIO(socketIo.init(server));
