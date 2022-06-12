//import dependencies

const express = require("express");
const app = express();
const morgan = require("morgan");

//set up logging to write to log.txt

fs = require("fs");
path = require("path");
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
app.use(morgan("combined", {stream: accessLogStream}));


//URL req handling

app.use(express.static('public'));
app.get("/", (req, res) => {
    res.send("Welcome to Florida in Film!");
  });
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Server Error");
  });
app.listen(8080, () => {
    console.log("Listening on port 8080");
  });