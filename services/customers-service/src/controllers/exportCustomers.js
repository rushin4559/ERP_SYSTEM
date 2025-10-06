const { findAllForExport } = require('../lib/customerDAL');
const { Parser } = require('json2csv'); // Use json2csv package for CSV conversion

async function exportCustomersCsvController(req, res) {
  try {
    // Extract filters from query, ignoring pagination params
    const {
      search,
      state_name,
      state_code,
      sort // optional, ignored here for export but can be included if needed
    } = req.query;

    const filters = { search, state_name, state_code };

    // Fetch filtered customers without pagination
    const customers = await findAllForExport(filters);

    if (!customers.length) {
      return res.status(404).json({ success: false, error: 'No customers found for export' });
    }

    // Define CSV fields/columns and order
    const fields = [
      'id',
      'customer_name',
      'vendor_code',
      'PAN_NO',
      'GSTN',
      'phone_no',
      'email_id',
      'state_code',
      'state_name',
      'address',
      'contact_person',
      'created_at',
      'updated_at'
    ];

    // Create JSON to CSV parser with fields
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(customers);

    // Set response headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="customers_export_${Date.now()}.csv"`);

    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting customers to CSV:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

module.exports = {
  exportCustomersCsvController,
};
