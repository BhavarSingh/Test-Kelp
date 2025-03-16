const express = require("express");
const fs = require("fs");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();

const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createTableIfNotExists() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.users (
          id SERIAL PRIMARY KEY,
          name VARCHAR NOT NULL,
          age INT NOT NULL,
          address JSONB NULL,
          additional_info JSONB NULL
      );
  `;
  await pool.query(createTableQuery);
}

app.get("/convert-csv", async (req, res) => {
  try {
    await createTableIfNotExists();
    const data = fs.readFileSync(process.env.CSV_FILE_PATH, "utf8");
    const lines = data.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    const users = lines.slice(1).map((line) => {
      const values = line.split(",");
      let user = {};
      let additionalInfo = {};

      values.forEach((value, index) => {
        const key = headers[index];
        const keys = key.split(".");
        value = value.trim();

        if (keys.length > 1) {
          let temp = user;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!temp[keys[i]]) {
              temp[keys[i]] = {};
            }
            temp = temp[keys[i]];
          }
          temp[keys[keys.length - 1]] = value;
        } else {
          user[keys[0]] = value;
        }
      });

      // Handle the required structured properties
      const fullName = `${user.name.firstName} ${user.name.lastName}`;
      const age = parseInt(user.age);
      delete user.name.firstName;
      delete user.name.lastName;
      delete user.age;

      return {
        name: fullName,
        age,
        address: JSON.stringify(user.address || {}),
        additional_info: JSON.stringify(user),
      };
    });

    // Read object and insert the user into the database
    for (const user of users) {
      await pool.query(
        "INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)",
        [user.name, user.age, user.address, user.additional_info]
      );
    }

    // calculate the age distribution
    const result = await pool.query(
      "SELECT age, COUNT(*) FROM public.users GROUP BY age ORDER BY age"
    );

    // logs the result
    result.rows.forEach((row) => {
      console.log(`Age ${row.age}: ${row.count}`);
    });

    res.send("CSV converted !");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
