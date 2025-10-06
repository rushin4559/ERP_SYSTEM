
const express = require("express");
const router = express.Router();

// Shared middlewares
const { requireAuth } = require("@myorg/shared-auth");
const { audit } = require("@myorg/shared-audit");

// --- Import Individual Controller Functions ---
const createCustomerController = require("../controllers/createCustomer")
const updateCustomerController = require("../controllers/updateCustomer");
const deleteCustomer = require("../controllers/deleteCustomer");
const deleteMultipleCustomers = require("../controllers/deleteMultipleCustomers");
const getCustomers = require("../controllers/getCustomers");
const { exportCustomersCsvController } = require("../controllers/exportCustomers");

// Apply requireAuth middleware to ALL routes in this service
router.use(requireAuth);

// 1. POST /api/customers - CREATE
router.post("/",
    audit("CREATE_CUSTOMER"),
    createCustomerController
);

// 2. PUT /api/customers/:id - UPDATE
router.put("/:id",
    audit("UPDATE_CUSTOMER"),
    updateCustomerController
);

// 4. DELETE /api/customers - DELETE MULTIPLE
router.delete("/",
    audit("DELETE_MULTIPLE_CUSTOMERS"),
    deleteMultipleCustomers
);

// 3. DELETE /api/customers/:id - DELETE (single)
router.delete("/:id",
    audit("DELETE_CUSTOMER"),
    deleteCustomer
);

// 5. GET /api/customers/:id - READ (single)
// router.get("/:id",
//     getCustomer
// );

// 6. GET /api/customers - READ (list with pagination/filter/sort)
router.get("/",
    getCustomers
);

// 7. GET /api/customers/export - EXPORT (CSV/Excel)
router.get("/export",
    audit("EXPORT_CUSTOMERS"),
    exportCustomersCsvController
);

// 8. GET /api/customers/:id/print - EXPORT PRINT (single customer bio-data)
// router.get("/:id/print",
//     audit("EXPORT_CUSTOMER_PRINT"),
//     exportCustomerPrint
// );

module.exports = router;