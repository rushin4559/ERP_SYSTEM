const { v4: uuidv4 } = require("uuid");
const { createCustomer } = require("../lib/customerDAL");

async function createCustomerController(req, res) {
  try {
    const data = req.body;

    // Validation
    if (!data.customer_name || data.customer_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Customer name is required" });
    }
    if (data.PAN_NO && data.PAN_NO.length !== 10) {
      return res.status(400).json({ success: false, message: "PAN_NO must be 10 characters long" });
    }
    if (data.GSTN && data.GSTN.length !== 15) {
      return res.status(400).json({ success: false, message: "GSTN must be 15 characters long" });
    }
    if (data.state_code && data.state_code.length !== 2) {
      return res.status(400).json({ success: false, message: "state_code must be 2 characters long" });
    }

    // Prepare customer object (with explicit UUID)
    const newCustomerData = {
      id: uuidv4(),
      customer_name: data.customer_name.trim(),
      address: data.address || null,
      vendor_code: data.vendor_code || null,
      phone_no: data.phone_no || null,
      email_id: data.email_id || null,
      contact_person: data.contact_person || null,
      PAN_NO: data.PAN_NO || null,
      GSTN: data.GSTN || null,
      state_code: data.state_code || null,
      state_name: data.state_name || null,
    };

    const newCustomer = await createCustomer(newCustomerData);

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: newCustomer,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry. Vendor Code, PAN_NO, or GSTN already exists.",
      });
    }
    console.error("Error creating customer:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = createCustomerController;
