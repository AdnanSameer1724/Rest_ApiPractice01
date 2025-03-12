require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const routing = require("./routes/index");
app.use("/adnan", routing);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));