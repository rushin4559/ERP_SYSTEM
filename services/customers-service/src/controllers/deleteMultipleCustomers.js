const customerDAL = require("../lib/customerDAL");

/**
 * Delete multiple customers by array of IDs
 * Method: DELETE /api/customers
 * Body: { ids: ["id1", "id2", ...] }
 */
module.exports = async function deleteMultipleCustomersController(req, res) {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Array of customer IDs is required." });
    }

    let deletedCount = 0;

    for (const id of ids) {
      const result = await customerDAL.deleteCustomer(id);
      if (result > 0) deletedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} customer(s) successfully.`,
      deletedCount,
    });
  } catch (err) {
    console.error("Error deleting multiple customers:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
