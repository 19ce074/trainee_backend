require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Backend is runnign sucessfully" });
  res.send()
});

//route to check the databse connection 
app.get('/check-connection', (req, res) => {
  db.getConnection((error, connection) => {
    if (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).json({ message: 'Database connection error' });
    } else {
      console.log('Successfully connected to the database');
      res.status(200).json({ message: 'Database connection successful' });
      connection.release();
    }
  });
});
require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
