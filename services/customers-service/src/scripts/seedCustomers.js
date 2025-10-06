const dotenv = require("dotenv");
dotenv.config();

const { v4: uuidv4 } = require("uuid");
const { initDB, getDB } = require("@myorg/shared-db");

const TABLE_NAME = "customers";

// Helper to generate random strings/numbers
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomPhone() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function randomState() {
  const states = [
    { code: "MH", name: "Maharashtra" },
    { code: "DL", name: "Delhi" },
    { code: "KA", name: "Karnataka" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "GJ", name: "Gujarat" },
  ];
  return states[Math.floor(Math.random() * states.length)];
}

async function seedCustomers(count = 50) {
  const db = getDB();

  for (let i = 1; i <= count; i++) {
    const state = randomState();
    const customerData = {
      id: uuidv4(),
      customer_name: `Demo Customer ${i}`,
      address: `Demo Address ${i}`,
      vendor_code: `V${1000 + i}`,
      phone_no: randomPhone(),
      email_id: `demo${i}@example.com`,
      contact_person: `Person ${i}`,
      PAN_NO: randomString(10),
      GSTN: randomString(15),
      state_code: state.code,
      state_name: state.name,
    };

    const fields = Object.keys(customerData).join(", ");
    const placeholders = Object.keys(customerData).map(() => "?").join(", ");
    const values = Object.values(customerData);

    const query = `INSERT INTO ${TABLE_NAME} (${fields}) VALUES (${placeholders})`;
    await db.query(query, values);
  }

  console.log(`${count} demo customers inserted successfully!`);
  process.exit(0);
}

// --- Configuration ---
// NOTE: Replace these with your actual database credentials
const dbConfig = {
  host: process.env.DB_HOST, // e.g., "localhost"
  user: process.env.DB_USER, // e.g., "root"
  password: process.env.DB_PASS, // e.g., "mypassword123"
  database: process.env.DB_NAME, // e.g., "erp_system_db"
  connectionLimit: 5,
};
// ---------------------

// Run the seeding
async function runSeeder() {
    try {
        // 1. Initialize the database connection pool
        console.log("Initializing DB...");
        initDB(dbConfig); // <-- Call initDB with your configuration

        // 2. Run the seed function
        await seedCustomers();
    } catch (err) {
        console.error("Error seeding customers:", err);
        process.exit(1);
    }
}

runSeeder();
