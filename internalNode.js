var url = require('url')
var net = require('net')
var http = require('http')
//var http = require('https')

var serveConnectionOptions = {
	hostname : '127.0.0.1',
	port     : 8181
}

var a = 0;

var controlSocket = net.connect(serveConnectionOptions,function(){
	controlSocket.write('Welocme to IITG World.!\r\n');
});

controlSocket.on('data',function(data){
	_data = data.toString();
	var dataParts =  (_data.split('\r\r\n\n')[0]).split(' ')
	if(dataParts[0] == 'CONNECT'){
		var tempServeConnectionOptions = {
			hostname : '127.0.0.1',
			port     : dataParts[1]
		}
		var dataSocket = net.connect(tempServeConnectionOptions,function(){
			//dataSocket.write('We are passive ports.!\r\n');
		})
		var httpCurrentString = ''
		dataSocket.on('data',function(buffer){
			_buffer = buffer.toString();
			var stringParts = _buffer.split('\r\r\n\n')
			httpCurrentString += stringParts[0]
			if(stringParts.length > 1){
				var httpRequestString = httpCurrentString
				httpCurrentString = stringParts[1]
				httpRequestJson = JSON.parse(httpRequestString)
				var options = {
					hostname	: httpRequestJson.url.hostname,
					port		: 80,
					path		: httpRequestJson.url.path,
					method		: httpRequestJson.method,
					headers		: httpRequestJson.headers
				}
				httpResponseJson = {
					responseCode 	: 200,
					responseHeaders : '',
					responseData 	: ''
				}
				var httpRequestObj = http.request(options,function(response){
					httpResponseJson.responseCode = response.statusCode
					httpResponseJson.responseHeaders = response.headers
					response.on('data', function(responseBuffer){
						httpResponseJson.responseData += responseBuffer
					})
					response.on('end', function(){
						console.log(httpRequestJson.toString())
						dataSocket.write(JSON.stringify(httpResponseJson),'binary')
						//dataSocket.write(httpResponseJson)
						dataSocket.write('\r\r\n\n','binary')
						console.log("wrote everything")
					})
				})
				httpRequestObj.end()
			}
		})
		dataSocket.on('end',function(buffer){
			//dataSocket.write('Byee from IIT.!\r\n');
		})
	}
})