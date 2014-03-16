var url = require('url')
var net = require('net')
var http = require('http')
var https = require('https')

var serveConnectionOptions = {
	hostname : '127.0.0.1',
	port     : 8181
}

var controlSocket = net.connect(serveConnectionOptions,function(){
	controlSocket.write('Welocme to IITG Intranet.!\r\n');
});

controlSocket.on('data',function(data){
	_data = data.toString('binary');
	var dataParts =  (_data.split('\r\r\n\n')[0]).split(' ')
	if(dataParts[0] == 'PASV'){
		var tempServeConnectionOptions = {
			hostname : dataParts[1],
			port     : dataParts[2]
		}
		var dataSocket = net.connect(tempServeConnectionOptions,function(){
		})
		var httpCurrentString = ''
		dataSocket.on('data',function(buffer){
			_buffer = buffer.toString('binary');
			var stringParts = _buffer.split('\r\r\n\n')
			httpCurrentString += stringParts[0]
			if(stringParts.length > 1){
				var httpRequestString = httpCurrentString
				httpCurrentString = stringParts[1]
				httpRequestJson = JSON.parse(httpRequestString)
				var options = {
					hostname	: httpRequestJson.url.hostname,
					port		: httpRequestJson.url.port||80,
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
					var buffArray = new Array()
					response.on('data', function(responseBuffer){
						buffArray.push(responseBuffer)
					})
					response.on('end', function(){
						httpResponseJson.responseData = Buffer.concat(buffArray);
						var buff = new Buffer(JSON.stringify(httpResponseJson) + '\r\r\n\n' )
						dataSocket.write(buff)
					})
				})
				httpRequestObj.end()
			}
		})
		dataSocket.on('end',function(buffer){
		})
	}
})