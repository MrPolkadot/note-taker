const express = require("express");

const path = require("path");

const app = express();

const fs = require("fs");
const PORT = 2099;

console.log("starting");

app.use(express.static(__dirname));
//app.use(express.urlencoded({ extended: true }));


app.get("*", (req, res) => res.sendFile(__dirname + "/index.html"));



app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));



