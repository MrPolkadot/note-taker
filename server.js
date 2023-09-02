const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const notesDB = require("./db/db.json");
const app = express();

const PORT = process.env.PORT || 2099;


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

const noteData = fs.readFileSync("./db/db.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else return data;

});
const notes = JSON.parse(noteData);
app.post("/api/notes", (req, res) => {
    console.log(req.body);

    // const noteData = fs.readFileSync("./db/db.json", "utf-8", (err, data) => {
    //     if (err) {
    //         console.log(err);
    //     } else return data;

    // });
    // const notes = JSON.parse(noteData);

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

app.get("/api/notes/:note_id", (req, res) => {
    if (req.params.note_id) {
        const noteId = req.params.note_id;
        for (let i = 0; i < notesDB.length; i++) {
            const currentNote = notesDB[i];
            if (currentNote.note_id === noteId) {
                res.json(currentNote);
                return;
            }
        }
        res.status(404).send("Note not found.")
    } else {
        res.status(404).send("Note id not provided.")
    }

    //res.json(notes[req.params.id]);

})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id * 1;
    const deleteNote = notes.find(el => el.id === id);
    const index = movies.indexOf(deleteNote);

    notes.splice(index, 1);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, "\t"), err => {
        if (err) throw err;
        //return true;
    });
})

app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "public/notes.html"))
);


app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html"))
);


app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));