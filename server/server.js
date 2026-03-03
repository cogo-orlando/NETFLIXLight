const http = require('http');
const server = http.createServer((req, res) => {
    res.end('Voila le server');
});

server.listen(process.env.PORT || 8080, () => {
    console.log('Server running on port 8080');
});