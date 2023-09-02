const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const app = express();

const PORT = 2099;


console.log("starting");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));




//WORK ON THIS!
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "an error occurred while reading the database." });
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    })


});


app.post("/api/notes", (req, res) => {
    console.log(req.body);

    const noteData = fs.readFileSync("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        } else return data;

    });
    const notes = JSON.parse(noteData);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4()

        };
        notes.push(newNote);


        fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, "\t"), err => {
            if (err) throw err;
            //return true;
        });
        res.json(notes);

    }

})


app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "public/notes.html"))
);


app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html"))
);


app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));