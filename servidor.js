var http = require("http");

http.createServer(function(request, response){
	response.writeHead(200);
	response.write('Teste');
	response.end();
}).listen(8880);
console.log('Server running..');
