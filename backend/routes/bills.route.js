import express from "express";
import { addBill, getBills } from "../controllers/bills.controller.js";

const router = express.Router();

router.get("/getbill", getBills);
router.post("/addbills", addBill);

export default router;
