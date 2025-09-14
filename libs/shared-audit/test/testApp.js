const express = require("express");
const { initAudit, audit, closeAudit } = require("../index");

// dummy DB config (use test DB or sqlite/mysql docker)
initAudit({
  host: "localhost",
  user: "root",
  password: "Keshrushi@45",
  database: "auditdb"
});


const app = express();

app.get("/ping", audit("PING_TEST"), (req, res) => {
  res.status(200).send("pong");
});

app.get("/fail", audit("FAIL_TEST"), (req, res) => {
  res.status(500).send("error");
});

app.listen(4000, () => {
  console.log("Test audit app running on port 4000");
});

// for cleanup in tests: closeAudit();
