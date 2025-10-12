const customerDAL = require("../lib/customerDAL");

/**
 * Get customers with filters, sorting, and pagination
 * Method: GET /api/customers
 * Query params:
 * - page (default 1)
 * - limit (default 10)
 * - customer_name
 * - state_name
 * - created_at_min
 * - created_at_max
 * - updated_at_min
 * - updated_at_max
 * - sort_by (created_at or updated_at)
 * - order (asc or desc)
 */
module.exports = async function getCustomersController(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      customer_name,
      state_name,
      created_at_min,
      created_at_max,
      updated_at_min,
      updated_at_max,
      sort_by = "updated_at",
      order = "desc",
    } = req.query;

    const offset = (page - 1) * limit;

    const queryParams = {
      customer_name,
      state_name,
      created_at_min,
      created_at_max,
      updated_at_min,
      updated_at_max,
      sort_by,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    // fetch filtered & paginated customers
    const { rows, total } = await customerDAL.findAllWithFilters(queryParams);

    return res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
