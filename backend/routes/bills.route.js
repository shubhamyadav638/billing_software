import express from "express";
import {
  addBill,
  cancelBill,
  getBills,
} from "../controllers/bills.controller.js";

const router = express.Router();

router.get("/getbill", getBills);
router.post("/addbills", addBill);
router.put("/cancel/:billId", cancelBill);

export default router;
