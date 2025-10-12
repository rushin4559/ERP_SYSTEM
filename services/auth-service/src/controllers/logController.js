const { getDB } = require("@myorg/shared-db")
const { Parser } = require("json2csv"); // CSV साठी
const ExcelJS = require("exceljs");     // Excel साठी
exports.getLogs = async (req, res) => {
  try {
    const pool = getDB();
    const { page = 1, limit = 20, username, status, action, from, to, sort } = req.query;

    // Base filters
    let where = " WHERE 1=1";
    const params = [];

    // Username filter directly on audit_logs.username (not joined)
    if (username) {
      where += " AND al.username LIKE ?";
      params.push(`%${username}%`);
    }

    if (action) {
      where += " AND al.action LIKE ?";
      params.push(`%${action}%`);
    }

    // Status filter
    if (status) {
      if (status === "success") {
        where += " AND al.status = 200";
      } else if (status === "failure") {
        where += " AND al.status != 200";
      }
    }

    // Date range filter
    if (from && to) {
      where += " AND al.created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    // Count total logs for pagination
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM audit_logs al ${where}`,
      params
    );
    const total = countRows[0].total;

    // Sorting 
    const allowedCols = ["created_at", "action", "status"];
    let orderBy = "al.created_at DESC";
    if (sort) {
      const [col, dir] = sort.split(":");
      if (allowedCols.includes(col)) {
        orderBy = `al.${col} ${dir && dir.toUpperCase() === "ASC" ? "ASC" : "DESC"}`;
      }
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Final query selecting username directly from audit_logs
    const sql = `
      SELECT al.* 
      FROM audit_logs al
      ${where}
      ORDER BY ${orderBy}
      LIMIT ${limitNum} OFFSET ${offset}
    `;

    const [rows] = await pool.execute(sql, params);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};


exports.exportLogs = async (req, res) => {
  try {
    const pool = getDB();
    const { username, status, action, from, to, format = "csv" } = req.query;

    // Base SQL without join; username in audit_logs now
    let sql = `
      SELECT id, action, service, status, created_at, username
      FROM audit_logs
      WHERE 1=1
    `;
    const params = [];

    // Username filter
    if (username) {
      sql += " AND username LIKE ?";
      params.push(`%${username}%`);
    }
    if (action) {
      sql += " AND action LIKE ?";
      params.push(`%${action}%`);
    }

    // Status filter
    if (status) {
      if (status === "success") {
        sql += " AND status = 200";
      } else if (status === "failure") {
        sql += " AND status != 200";
      }
    }

    // Date filter
    if (from && to) {
      sql += " AND created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    // Order by most recent
    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.execute(sql, params);

    if (rows.length === 0) {
      return res.status(200).send("No logs found for the selected filters.");
    }

    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Audit Logs");
      sheet.columns = Object.keys(rows[0]).map(col => ({ header: col, key: col }));
      rows.forEach(r => sheet.addRow(r));

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=audit_logs.xlsx");
      await workbook.xlsx.write(res);
      res.end();
    } else {
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

