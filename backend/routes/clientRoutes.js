const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Ensure the following lines are correct
router.post("/create", clientController.createClient);
router.get("/", clientController.getClients);
router.get("/:gstin", clientController.getClientByGSTIN);
router.put("/:gstin", clientController.updateClient);
router.delete("/:gstin", clientController.deleteClient);

module.exports = router;  // Ensure you're exporting the router correctly
