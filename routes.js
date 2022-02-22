const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const urlShortner = require('./models/urlShortner')
// helper functions
const testUrl = require('./helperFunctions/testUrl')
const makeJson = require('./helperFunctions/dbFunctions').makeJson
const findOrigUrl = require('./helperFunctions/dbFunctions').findOrigUrl
const findShortUrl = require('./helperFunctions/dbFunctions').findShortUrl
const docsCount = require('./helperFunctions/dbFunctions').docsCount
const clearAll = require('./helperFunctions/dbFunctions').clearAll

// body-parser for POST requests at '/api/shorturl'
router.use('/shorturl', bodyParser.urlencoded({ extended: false }))

// GET requests at root
router.get('/', (req, res) => {
   res.sendFile(__dirname + '/views/index.html')
})

// GET requests at api/shorturl/[shorturl]
router.get('/shorturl/:short?', (req, res) => {
   const shortUrl = req.params.short
   findShortUrl(urlShortner, shortUrl, (err, document) => {
      if (err) return console.log(err)
      if (document) return res.redirect(document.original_url)
      res.send(`no document found with short_url: ${shortUrl}`)
   })
})

// POST requests to api/shorturl
router.post("/shorturl", (req, res) => {
   const inputUrl = req.body.url;
   // check url validity
   if (!testUrl(inputUrl)) {
     // not valid, return res.json
     console.log('invalid url')
     return res.json({ error: 'invalid url' })
   }
   // valid, check if url is an entry in db
   findOrigUrl(urlShortner, inputUrl, (err, document) => {
      if (err) return console.log(err)
      // url matches with an entry in database, res.json with url data
      if (document) {
         console.log(`${document.original_url} is already in database with short_url: ${document.short_url}`)
         return res.json(makeJson(inputUrl, document.short_url))
      }
      // no match, create and save new document, then res.json
      docsCount(urlShortner, (err, count) => {
         if (err) return console.log(err)
         new urlShortner(makeJson(inputUrl, count +1)).save((err) => {
            if (err) return console.log(`could not save document: ${err}`)
            res.json(makeJson(inputUrl, count +1))
         })
      })
   })
})

module.exports = router