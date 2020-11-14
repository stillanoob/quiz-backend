const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    motdepasse: String,
    datenaissance: String,
    scores: [{
        quiz: String, score: Number}],
    isadmin: Boolean,
});

module.exports = mongoose.model("user", userSchema);
