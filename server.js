import http from 'http';
 
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html'});
  res.write('<html><body><h1>Hello World</h1><p>Welcome to my first Node.js web page</p></body></html>');
  res.end();
}).listen(3000);

