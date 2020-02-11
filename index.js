const webScraper = require('./dist/lib/webscraper')
const IG_HANDLE = process.env.IG_HANDLE || 'leomessi';
webScraper.webScraper(IG_HANDLE).then(result => console.log(result))
