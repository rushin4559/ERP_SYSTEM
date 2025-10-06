// controllers/updateCustomer.js
const customerDAL = require("../lib/customerDAL");

/**
 * Update a customer by ID
 * Method: PUT /api/customers/:id
 */
module.exports = async function updateCustomerController(req, res) {
    try {
        const { id } = req.params;
        const customerData = req.body;
        console.log("Received update request for customer ID:", id, "with data:", customerData);

        // 🔹 Validation
        if (!id) {
            return res.status(400).json({ success: false, message: "Customer ID is required." });
        }

        if (customerData.customer_name !== undefined && customerData.customer_name.trim() === "") {
            return res.status(400).json({ success: false, message: "Customer name cannot be empty." });
        }

        if (customerData.PAN_NO && customerData.PAN_NO.length !== 10) {
            return res.status(400).json({ success: false, message: "PAN_NO must be 10 characters long." });
        }

        if (customerData.GSTN && customerData.GSTN.length !== 15) {
            return res.status(400).json({ success: false, message: "GSTN must be 15 characters long." });
        }

        if (customerData.state_code && customerData.state_code.length !== 2) {
            return res.status(400).json({ success: false, message: "state_code must be 2 characters long." });
        }

        if (!customerData || Object.keys(customerData).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update." });
        }

        // 🔹 Update
        const updatedCustomer = await customerDAL.updateCustomer(id, customerData);
        console.log("Updated customer:", updatedCustomer);

        if (!updatedCustomer) {
            return res.status(404).json({ success: false, error: "Customer not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: updatedCustomer,
        });
    } catch (err) {
        console.error("Error updating customer:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Duplicate entry. Vendor Code, PAN_NO, or GSTN already exists.",
            });
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
