//Imports packages and modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const notesDB = require("./db/db.json");

//Retrieves all of express.js methods for use
const app = express();


//Creates a port to deploy our server
const PORT = process.env.PORT || 2099;


console.log("Starting");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


//Reads the json file and parses it
const noteData = fs.readFileSync("./db/db.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else return data;

});
const notes = JSON.parse(noteData);



//Reads all of the notes and returns the notes to the client in json
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



//Receives a new note to save on the request body, adds it to the db.json file, and then returns the new note to the client
app.post("/api/notes", (req, res) => {
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
        });
        res.json(notes);
    }

})


//Creates a route to get a specific note with it's id and return it to the client
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
})


//Deletes note based on the note id given
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id * 1; //Creates the id string type into a number type
    const deleteNote = notes.find(el => el.id === id); //Returns the first id from the array that matches the input id
    const index = notes.indexOf(deleteNote); //Returns the index of the found id

    notes.splice(index, 1); //Deletes item(id) from the array
    fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, "\t"), err => {
        if (err) throw err;
        //return true;
    });
    res.json(notes);
})


//Route to return the notes.html file
app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "public/notes.html"))
);



//Route to return the index.html file
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html"))
);



//Listens to the port and deploys the server
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));