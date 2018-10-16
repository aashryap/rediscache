const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    nconst : {
        type : String
    },
    name : {
        type : String
    },
    primaryName : {
        type : String
    },
    birthYear : {
        type : Number
    },
    deathYear : {
        type : Number
    },
    primaryProfession : {
        type : String
    },
    knownForTitles : {
        type : String
    }
})

const person = mongoose.model("Name", schema);

module.exports = person;

