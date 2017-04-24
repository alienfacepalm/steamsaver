const http = require('http');

class Server {

	constructor(port){
		this.PORT = port;
		this.server = null;
	}

	start(){
		this.server = http.createServer((request, response) => {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify({"status": 200}));
		});

		this.server.listen(this.PORT);
	}

	stop(){
		this.server.close();
		this.server = null;
	}

	get running(){
		return this.server ? true : false; 
	}

}

module.exports = Server;