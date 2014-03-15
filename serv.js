var http = require('http')
var net = require('net')
var url = require('url')

var gres;
var greq;

//NAT backchodi
net.createServer(function(sock){
	//var u = url.parse(req.url)
	//res.writeHead(200, {"Content-Type": "text/html"})
	//res.write('hello world')
	gres = sock
	greq = sock
}).listen(8181)

//webserver (proxy)
http.createServer(function(req, res){
	var tos = {u: url.parse(req.url), method: req.method, headers: req.headers}
	sreq = JSON.stringify(tos) + '\r\r\n\n'
	gres.write(sreq)
	var imp=''
	var rem=''
	greq.on('data', function(data){
		rem += data.toString('utf8')
		var sp = rem.split('\r\r\n\n')
		imp += sp[0]
		if (sp.length>1){
			rem = sp[1]
			//imp contains data i want
			res.writeHead(200, {"Content-Type": "text/html"})
			res.write(imp)
			res.end()
			imp=''
		}
	})
}).listen(8080)
