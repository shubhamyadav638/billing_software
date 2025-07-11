import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import databaseconnection from "./config/db.js";
import userRouter from "./routes/user.route.js";
import itemsRouter from "./routes/items.route.js";
import printerRouter from "./routes/printer.route.js";
import billRouter from "./routes/bills.route.js";

//! ========== Dot env =======
dotenv.config();

//! ========== database =======
databaseconnection();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

//!================== cors origin ========
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/Categoryimg", express.static("Categoryimg"));
app.use("/itemimg", express.static("itemimg"));
app.use("/userimg", express.static("userimg"));
//!============ Routes ==========
app.use("/api/v1/user", userRouter);
app.use("/api/v1/categoryitem", itemsRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/printer", printerRouter);
app.use("/api/v1/bill", billRouter);

//!============== Start server port no ==========
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
