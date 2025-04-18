import express from "express";
import {
  addBillItem,
  getAllBillItems,
} from "../controllers/billItem.controller.js";
import { addBill } from "../controllers/bills.controller.js";

const router = express.Router();

router.post("/addbillitem", addBillItem);
router.get("/getbill", getAllBillItems);
router.post("/addbills", addBill);

export default router;
