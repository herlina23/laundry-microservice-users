const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

//Environtment Variables
require("dotenv").config();

//Connect to Database
require("./config/db");

app.use(express.json());

app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/salaries", require("./routes/salaries"));
app.use("/api/v1/mreports", require("./routes/mreports"));
app.use("/api/v1/mreports_item", require("./routes/mreports_item"));
app.use("/api/v1/dreports", require("./routes/dreports"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`Server started on Port ${PORT}`));
