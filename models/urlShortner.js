const mongoose = require('mongoose')

// Schema for urlDatabase
const urlShortnerSchema = new mongoose.Schema({
   original_url: String,
   short_url: Number
})

// convert Schema into a model
const urlShortner = mongoose.model('urlShortener', urlShortnerSchema)

module.exports = urlShortner