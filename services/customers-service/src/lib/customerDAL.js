// Access the shared database connection pool
const { getDB } = require("@myorg/shared-db"); 

const { v4: uuidv4 } = require("uuid");
const TABLE_NAME = 'customers';

/**
 * Helper to build dynamic WHERE and ORDER BY clauses for listing and export.
 * @param {object} queryParams - Filters, search term, and sort from the controller.
 * @returns {object} { whereClause, orderClause, sqlParams }
 */
const buildQueryParts = (queryParams) => {
    let whereParts = [];
    let sqlParams = [];

    // 1. Searching (on customer_name)
    if (queryParams.search) {
        whereParts.push("customer_name LIKE ?");
        sqlParams.push(`%${queryParams.search}%`);
    }

    // 2. Filtering (on state_name)
    if (queryParams.state_name) {
        whereParts.push("state_name = ?");
        sqlParams.push(queryParams.state_name);
    }
    
    // 3. Filtering (on state_code, etc. - Expandable)
    if (queryParams.state_code) {
        whereParts.push("state_code = ?");
        sqlParams.push(queryParams.state_code);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    // 4. Sorting
    let orderClause = 'ORDER BY created_at DESC'; // Default sort
    if (queryParams.sort) {
        const [field, direction] = queryParams.sort.split(':');
        const allowed = ['customer_name', 'state_name', 'created_at', 'vendor_code'];
        const safeField = allowed.includes(field) ? field : 'created_at';
        const safeDirection = direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        orderClause = `ORDER BY ${safeField} ${safeDirection}`;
    }

    return { whereClause, orderClause, sqlParams };
};

/**
 * Creates a new customer record.
 */
async function createCustomer(customerData) {
  const db = getDB();
  const id = customerData.id || uuidv4(); // Generate UUID if not provided

  const newData = { ...customerData, id };

  const fields = Object.keys(newData).join(", ");
  const placeholders = Object.keys(newData).map(() => "?").join(", ");
  const values = Object.values(newData);

  const query = `INSERT INTO ${TABLE_NAME} (${fields}) VALUES (${placeholders})`;
  await db.query(query, values);

  const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [id]);
  return rows[0];
}

/**
 * Executes a SELECT query with Pagination, Search, Filtering, and Sorting.
 */
async function findCustomers({ page = 1, limit = 10, ...queryParams }) {
    const db = getDB();
    const { whereClause, orderClause, sqlParams } = buildQueryParts(queryParams);
    const offset = (page - 1) * limit;

    // 1. Get total count
    const countQuery = `SELECT COUNT(id) AS total FROM ${TABLE_NAME} ${whereClause}`;
    const [countRows] = await db.query(countQuery, sqlParams);
    const totalCount = countRows[0].total;

    // 2. Get paginated data
    const dataQuery = `
        SELECT * FROM ${TABLE_NAME} 
        ${whereClause} 
        ${orderClause} 
        LIMIT ? OFFSET ?
    `;
    const [dataRows] = await db.query(dataQuery, [...sqlParams, limit, offset]);

    return {
        data: dataRows,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
    };
}

/**
 * Fetches a single customer by ID.
 */
async function findCustomerById(id) {
    const db = getDB();
    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

/**
 * Updates an existing customer record.
 */
async function updateCustomer(id, customerData) {
    const db = getDB();
    
    // 💡 Whitelist all fields that are ALLOWED to be updated.
    const updatableFields = [
        'customer_name', 'vendor_code', 'PAN_NO', 'GSTN', 'phone_no', 
        'email_id', 'state_code', 'state_name', 'address', 'contact_person' 
        // DO NOT include 'id', 'created_at', or other sensitive/immutable fields.
    ];
    
    const setParts = [];
    const values = [];

    // Filter the customerData based on the whitelist
    for (const field of updatableFields) {
        if (customerData[field] !== undefined) { // Check if the field was actually sent
            setParts.push(`${field} = ?`);
            values.push(customerData[field]);
        }
    }
    
    // Manually add 'updated_at' to the query (optional, but good practice)
    setParts.push(`updated_at = ?`);
    values.push(new Date()); // Use the JS Date object for the current time
    
    if (setParts.length === 0) {
        throw new Error("No valid fields provided for update.");
    }
    
    values.push(id); // ID goes last for the WHERE clause

    const query = `UPDATE ${TABLE_NAME} SET ${setParts.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    
    // Return the updated customer data
    return findCustomerById(id); 
}

/**
 * Deletes a customer record by ID.
 */
async function deleteCustomer(id) {
    const db = getDB();
    const query = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows; // Returns 1 if deleted, 0 if not found
}

/**
 * Fetches all customers based on filters (used for export).
 */
async function findAllForExport(queryParams = {}) {
    const db = getDB();
    // Use the same filtering logic, but ignore pagination/sorting direction for simple export
    const { whereClause, sqlParams } = buildQueryParts(queryParams); 
    
    // Order by name for a clean export file
    const query = `SELECT * FROM ${TABLE_NAME} ${whereClause} ORDER BY customer_name ASC`;
    const [rows] = await db.query(query, sqlParams);
    return rows;
}

async function findAllWithFilters({
  customer_name,
  state_name,
  created_at_min,
  created_at_max,
  updated_at_min,
  updated_at_max,
  sort_by = "created_at",
  order = "asc",
  limit = 10,
  offset = 0,
}) {
  const db = getDB();
  const conditions = [];
  const params = [];

  if (customer_name) {
    conditions.push(`customer_name LIKE ?`);
    params.push(`${customer_name}%`); // starts with
  }

  if (state_name) {
    conditions.push(`state_name LIKE ?`);
    params.push(`%${state_name}%`); // contains
  }

  if (created_at_min) {
    conditions.push(`created_at >= ?`);
    params.push(created_at_min);
  }

  if (created_at_max) {
    conditions.push(`created_at <= ?`);
    params.push(created_at_max);
  }

  if (updated_at_min) {
    conditions.push(`updated_at >= ?`);
    params.push(updated_at_min);
  }

  if (updated_at_max) {
    conditions.push(`updated_at <= ?`);
    params.push(updated_at_max);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await db.query(
    `SELECT * FROM ${TABLE_NAME} ${whereClause} ORDER BY ${sort_by} ${order} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countResult] = await db.query(
    `SELECT COUNT(*) as total FROM ${TABLE_NAME} ${whereClause}`,
    params
  );

  return { rows, total: countResult[0].total };
}


module.exports = {
    createCustomer,
    findCustomers,
    findCustomerById,
    updateCustomer,
    deleteCustomer,
    findAllForExport,
    findAllWithFilters
};
