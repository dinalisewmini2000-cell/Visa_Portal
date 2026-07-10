const http = require('http');

http.get('http://localhost:5005/api/applications', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Response Code: ${res.statusCode}`);
    console.log(`Response Body: ${data}`);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
