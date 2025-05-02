const Client = require("../models/Client");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { clientName, clientGSTIN, clientAddress, clientState, clientStateCode } = req.body;

    // Check if the client already exists in the database by GSTIN
    let existingClient = await Client.findOne({ gstin: clientGSTIN });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this GSTIN already exists" });
    }

    // Create a new client
    const newClient = new Client({
      name: clientName,
      gstin: clientGSTIN,
      address: clientAddress,
      state: clientState,
      stateCode: clientStateCode,
    });

    // Save the client to the database
    await newClient.save();
    res.status(201).json({ message: "Client created successfully", client: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create client", error: err.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve clients", error: err.message });
  }
};

// Get a client by GSTIN
exports.getClientByGSTIN = async (req, res) => {
  try {
    const client = await Client.findOne({ gstin: req.params.gstin });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve client", error: err.message });
  }
};

// Update client details
exports.updateClient = async (req, res) => {
  try {
    const { clientName, clientGSTIN, clientAddress, clientState, clientStateCode } = req.body;

    // Find the client by GSTIN
    const updatedClient = await Client.findOneAndUpdate(
      { gstin: req.params.gstin },  // Find by GSTIN
      { clientName, clientGSTIN, clientAddress, clientState, clientStateCode }, // Update fields
      { new: true }  // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully", client: updatedClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update client", error: err.message });
  }
};

// Delete a client by GSTIN
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ gstin: req.params.gstin });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete client", error: err.message });
  }
};
