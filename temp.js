http.createServer(function(req, res){
	var u = url.parse(req.url)
	res.writeHead(200, {"Content-Type": "text/html"})
	res.write('hello world')
	
}).listen(8080)
