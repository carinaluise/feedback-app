const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// let filepath = "sqlite-container://192.168.65.254/feedbackDB.db";
let filepath = "http://localhost:9900/feedbackDB.db";

const db = new sqlite3.Database(filepath, (error) => {
  if (error) {
    return console.error(error.message);
  }
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT)"
  );
});

app.post("/submit-feedback", (req, res) => {
  const { name, email, message } = req.body;

  db.run(
    "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    function (err) {
      if (err) {
        return console.error(
          "Error inserting feedback into database:",
          err.message
        );
      }
      console.log(`A new feedback with id ${this.lastID} has been inserted`);
    }
  );

  res.send("Feedback received successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
