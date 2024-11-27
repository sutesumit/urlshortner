require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Added Dependencies
const dns = require('dns')
const urlParser = require('url')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Database
const urlDataBase = {}


// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {

  const original_url = req.body.url
  const parsed_url = urlParser.parse(original_url).hostname


  const dnslookup = dns.lookup((parsed_url), (error, address) => {
    if(error || !address){
      res.json({ error: 'invalid url' })
    } else {
      short_url = Object.keys(urlDataBase).length + 1
      urlDataBase[short_url] = original_url
      res.json({ original_url: original_url, short_url: short_url });
    }
    
  })

});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params
  const redirect_link = urlDataBase[String(short_url)]
  res.redirect(redirect_link)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
