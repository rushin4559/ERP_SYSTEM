const { getDB } = require("@myorg/shared-db")
const { Parser } = require("json2csv"); // CSV साठी
const ExcelJS = require("exceljs");     // Excel साठी
exports.getLogs = async (req, res) => {
  try {
    const pool = getDB();
    const { page = 1, limit = 20, search, status, service, from, to, sort } = req.query;

    // base filters
    let where = " WHERE 1=1";
    let params = [];

    if (search) {
      where += " AND (al.action LIKE ? OR al.service LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      where += " AND al.status = ?";
      params.push(status);
    }
    if (service) {
      where += " AND al.service = ?";
      params.push(service);
    }
    if (from && to) {
      where += " AND al.created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    // Count query
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM audit_logs al 
       LEFT JOIN users u ON al.user_id = u.id
       ${where}`,
      params
    );
    const total = countRows[0].total;

    // Sorting (safe)
    const allowedCols = ["created_at", "action", "service", "status"];
    let orderBy = "al.created_at DESC";
    if (sort) {
      const [col, dir] = sort.split(":");
      if (allowedCols.includes(col)) {
        orderBy = `al.${col} ${dir && dir.toUpperCase() === "ASC" ? "ASC" : "DESC"}`;
      }
    }

    // Pagination
    const offset = (page - 1) * limit;
    const sql = `
      SELECT al.*, u.username 
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${where}
      ORDER BY ${orderBy}
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;
    const [rows] = await pool.execute(sql, params);

    res.json({ page: Number(page), limit: Number(limit), total, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

exports.exportLogs = async (req, res) => {
  try {
    const pool = getDB();
    const { search, status, service, from, to, format = "csv" } = req.query;

    let sql = `
      SELECT al.id, al.user_id, u.username, al.action, al.service, al.status, al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    let params = [];

    if (search) {
      sql += " AND (al.action LIKE ? OR al.service LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      sql += " AND al.status = ?";
      params.push(status);
    }
    if (service) {
      sql += " AND al.service = ?";
      params.push(service);
    }
    if (from && to) {
      sql += " AND al.created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    sql += " ORDER BY al.created_at DESC";

    const [rows] = await pool.execute(sql, params);

    if (format === "excel") {
      // Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Audit Logs");
      sheet.columns = Object.keys(rows[0] || {}).map(col => ({ header: col, key: col }));
      rows.forEach(r => sheet.addRow(r));

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=audit_logs.xlsx");
      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Default → CSV
      const parser = new Parser();
      const csv = parser.parse(rows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=audit_logs.csv");
      res.send(csv);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export logs" });
  }
};
