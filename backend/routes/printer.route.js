import express from "express";
import { handlePrint } from "../controllers/printer.controller.js";

const router = express.Router();

router.post("/print", handlePrint);

export default router;
