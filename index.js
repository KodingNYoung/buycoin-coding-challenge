const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config()

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
  console.log(`listening at ${port}.`);  
})

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/github', (request, response) => { 
  console.log('request recieved!');

  const option = {
    method: 'POST',
    body: JSON.stringify(request.body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
  }

  // the real fetch request
  fetch('https://api.github.com/graphql', option)
  .then(res => res.json())
  .then(data => response.json({data: data}))
  .catch(err => response.json({error: err}))
})