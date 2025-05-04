const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createInvoice,
  getLatestInvoice,
  getInvoiceById,
  updateInvoice
} = require("../controllers/invoiceController");

router.post("/", auth, createInvoice);
router.get("/:id", auth, getInvoiceById);
router.put("/:id", auth, updateInvoice);
router.get("/latest", auth, getLatestInvoice);

module.exports = router;
