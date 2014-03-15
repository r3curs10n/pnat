var net = require('net')
var http = require('http')
var url = require('url')

require('node-monkey').start({host: "127.0.0.1", port:"5050"});

/**/

serverOptions = 
{
	hostname: '127.0.0.1',
	port: 8181,
	path: '/',
	method: 'GET'
}

var rres = net.connect({hostname: '127.0.0.1', port:8181}, function(){})

var sreq=''; var rem = '';
rres.on('data', function(data){
	rem += data.toString('utf8')
	sp = rem.split('\r\r\n\n')
	sreq += sp[0]
	if (sp.length > 1){
		rem = sp[1]
		
		//dejsonify
		req = JSON.parse(sreq)
		
		console.log(req)
		var rrreq = http.request({host:req.u.host, port:80, path:req.u.path, method: req.method, headers: req.headers }, function (rrres){
			console.log(rrres)
			//rres.writeHead(rrres.statusCode, rrres.headers);
			rrres.on('data', function(data){
				rres.write(data)
				//console.log(data)
			})
			rrres.on('end', function(){
				rres.write('\r\r\n\n')
			})
		})
		rrreq.end()
		sreq=''
	}
})

/*var rreq = net.request(serverOptions, function(rres){
	var sreq=''; var rem = '';
	rres.on('data', function(data){
		rem += data.toString('utf8')
		sp = rem.split('\r\r\n\n')
		sreq += sp[0]
		if (sp.length > 1){
			rem = sp[1]
			
			//dejsonify
			req = JSON.parse(sreq)
			
			console.log(req)
			var rrreq = http.request({host:req.u.host, port:80, path:req.u.path, method: req.method, headers: req.headers }, function (rrres){
				console.log(rrres)
				//rres.writeHead(rrres.statusCode, rrres.headers);
				rrres.on('data', function(data){
					rres.write(data)
					//console.log(data)
				})
				rrres.on('end', function(){
					rres.write('\r\r\n\n')
				})
			})
			rrreq.end()
			sreq=''
		}
	})
})
rreq.end()*/
