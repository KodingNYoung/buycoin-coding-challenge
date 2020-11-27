const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config()

// this will notify you in the command line whenever you start the server at port 3000
app.listen(4000, ()=> {
  console.log('listening at 4000.');  
})

// line 12 will serve the files in the public folder, so, all the frontend will be in the public folder
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// '/github' is a route that will handle the request, so this is the url we'll make the request to in the frontend
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