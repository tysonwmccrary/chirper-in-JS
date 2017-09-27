var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var clientPath = path.join(__dirname, '../client');
var dataPath = path.join(__dirname, 'data.json');

var server = http.createServer(function(request, response) {
    var urlData = url.parse(request.url, true);

    if (urlData.pathname === '/' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(clientPath, 'index.html')).pipe(response);
    } else if (urlData.pathname === '/api/chirps') {
        switch (response.method) {
            case 'GET':
                // GET LOGIC
                response.writeHead(200, { 'Content-Type': 'application/json' });
                fs.createReadStream(dataPath).pipe(response);
                break;
            case 'POST':
                // POST LOGIC
                fs.readFile(dataPath, 'utf8', function(error, fileContents) {
                    if (error) {
                        console.log(error);
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end('Internal Server Error');
                    } else {
                        var chirps = JSON.parse(fileContents);

                        var incomingData = '';
                        request.on('data', function(chunk) {
                            incomingData += chunk;
                        });
                        request.on('end', function() {
                            var newChirp = JSON.parse(incomingData);
                            chirps.push(newChirp);

                            var chirpsJSONData = JSON.stringify(chirps);
                            fs.writeFile(dataPath, chirpsJSONData, function(error) {
                                if (error) {
                                    console.log(error);
                                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                                    response.end('Internal Server Error');
                                } else {
                                    response.writeHead(201);
                                    response.end();
                                }
                            });
                        });
                    }
                });
                break;
        }
    } else if (request.method === 'GET') { // For all other GET requests
        var fileExtension = path.extname(urlData.pathname);
        var contentType;
        switch (fileExtension) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            default:
                contentType = 'text/plain';
        }

        var readStream = fs.createReadStream(path.join(clientPath, urlData.pathname));
        readStream.on('error', function (error) {
            response.writeHead(404);
            response.end();
        });
        response.writeHead(200, { 'Content-Type': contentType });
        readStream.pipe(response);
    }
});
console.log('Server listening on port 3000!');
server.listen(3000);