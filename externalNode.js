var http = require('http')
var net = require('net')
var url = require('url')

var globalSocket = new Array();

var a=0;
//The server that connects with internal Node.
net.createServer(function(sock){
	globalSocket.push(sock)
	sock.on('data', function (data) {
		console.log(data.toString())
	});
	sock.on('end', function () {
		var i = globalSocket.indexOf(sock);
		if(i != -1) {
			globalSocket.splice(i, 1);
		}
		//console.log("The END.")
	})
}).listen(8181)

http.createServer(function(request, response){
	if(globalSocket.length > 0){
		var httpRequestJson = {
			url		: url.parse(request.url),
			headers : request.headers,
			method	: request.method
		}
		var socketId = Math.floor(Math.random()*globalSocket.length);
		
		var passiveDataServer = net.createServer(function(sock){			
			sock.write(JSON.stringify(httpRequestJson),'binary')
			sock.write('\r\r\n\n','binary')
			var httpResponseBuffer = ''
			sock.on('data',function(data){
				console.log(data)
				_data = data.toString()
				var stringParts = _data.split('\r\r\n\n')
				httpResponseBuffer += stringParts[0]
				console.log(stringParts)
				if(stringParts.length > 1){
					console.log("here")
					var httpResponseJson = JSON.parse(httpResponseBuffer)
					httpResponseBuffer = stringParts[1]
					response.writeHead(httpResponseJson.responseCode,httpResponseJson.responseHeader)
					response.write(httpResponseJson.responseData,'binary')
					response.end()
				}
			})
		})
		passiveDataServer.listen( function(){
			address = passiveDataServer.address()
			var connectionSetupString = 'CONNECT '+ address.port +'\r\r\n\n'
			globalSocket[socketId].write(connectionSetupString,'binary')
		})
		//*/
	}
}).listen(8080)
