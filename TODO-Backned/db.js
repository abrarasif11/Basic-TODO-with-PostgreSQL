const { Pool } = require("pg");

const pool = new Pool({
  user: "postgresql",
  host: "localhost",
  database: "100903",
  password: "your_password",
  port: 5432,
});

module.exports = pool;
