const fetch = require('node-fetch')

let processIPs = (urls, field) => {
  console.log('processIPs', urls);
  urls.forEach(url => {
    fetch(url)
      .then(res => res.json())
      .then(text => console.log('fetch result', text))
      .catch(e => console.log(`fetching ${url} err`, e.message));
    fetch(url+'/move', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({a: 1, b: 'Textual content'})
    })
      .then(res => res.json())
      .then(text => console.log('fetch result', text))
      .catch(e => console.log(`fetching ${url} err`, e.message));
  });
  setTimeout(processIPs, 1000);
}


const Worker = (IPs, field) => {
  processIPs = processIPs.bind(null, IPs, field);
  setTimeout( processIPs, 1000);
}

module.exports = Worker;
