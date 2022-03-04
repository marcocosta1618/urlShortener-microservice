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
router.use('/api/shorturl', bodyParser.urlencoded({ extended: false }))

// GET requests at root
router.get('/', (req, res) => {
   res.sendFile(__dirname + '/views/index.html')
})

// GET requests at api/shorturl/[shorturl]
router.get('/api/shorturl/:shortUrl?', (req, res) => {
   const { shortUrl } = req.params
   findShortUrl(urlShortner, shortUrl, (err, document) => {
      if (err) throw new Error(err)
      if (document) return res.redirect(document.original_url)
      res.status(404).send(`404: no document found with short_url: ${shortUrl}`)
   })
})

// POST requests to api/shorturl
router.post("/api/shorturl", (req, res) => {
   const { userUrl } = req.body;
   // check url validity
   if (!testUrl(userUrl)) {
     // not valid, return res.json
     return res.status(400).json({ error: 'invalid url' })
   }
   // valid, check if url is an entry in db
   findOrigUrl(urlShortner, userUrl, (err, document) => {
      if (err) throw new Error(err)
      // url matches with an entry in database, res.json with url data
      if (document) {
         console.log(`${document.original_url} is already in database with short_url: ${document.short_url}`)
         return res.json(makeJson(userUrl, document.short_url))
      }
      // no match, create and save new document, then res.json
      docsCount(urlShortner, (err, count) => {
         if (err) throw new Error(err)
         new urlShortner(makeJson(userUrl, count +1)).save((err) => {
            if (err) throw new Error(`could not save document: ${err}`)
            res.json(makeJson(userUrl, count +1))
         })
      })
   })
})

module.exports = router