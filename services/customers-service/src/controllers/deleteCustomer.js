const customerDAL = require("../lib/customerDAL");

/**
 * Delete a single customer by ID
 * Method: DELETE /api/customers/:id
 */
module.exports = async function deleteCustomerController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: "Customer ID is required." });
    }

    const deletedRows = await customerDAL.deleteCustomer(id);

    if (deletedRows === 0) {
      return res.status(404).json({ success: false, error: "Customer not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully."
    });
  } catch (err) {
    console.error("Error deleting customer:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
