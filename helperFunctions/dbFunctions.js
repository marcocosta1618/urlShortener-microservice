const findOrigUrl = (document, url, done) => {
   document.findOne({ original_url: url }, (err, data) => {
      if (err) return done(err)
      done(null, data)
   })
}
const findShortUrl = (document, shortUrl, done) => {
   document.findOne({ short_url: shortUrl }, (err, data) => {
      if (err) return done(err)
      done(null, data)
   })
}
const docsCount = (model, done) => {
   model.estimatedDocumentCount((err, count) => {
      if (err) return done(err);
      done(null, count)
   })
}
// !!! clears the database
const clearAll = () => {
   urlShortner.deleteMany({}, (err, count) => {
      if (err) return console.log(err)
      console.log(count)
   })
}
const makeJson = (original, short) => ({
   original_url: original,
   short_url: short
})

module.exports.findOrigUrl = findOrigUrl
module.exports.findShortUrl = findShortUrl
module.exports.docsCount = docsCount
module.exports.clearAll = clearAll
module.exports.makeJson = makeJson