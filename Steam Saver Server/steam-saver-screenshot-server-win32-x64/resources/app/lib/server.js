const express = require('express');

const Screenshots = require('./screenshots');

let instance = null;

class Server {

	constructor(port){
		if(!instance){
			instance = this;
		}
		this.PORT = port;
		this.app = null;
		this.server = null;

		return instance;
	}

	get running(){
		return this.server ? true : false;
	}

	start(){
		console.log(`Starting HTTP Server`);

		this.app = express();

		this.server = this.app.listen(this.PORT || 3333, () => {
			console.log(`SteamSaver Server is running on ${this.PORT}`);

			let screenshots = new Screenshots;
  			screenshots.list()
	  			.then(screenshots => {
	  				this.feed(screenshots);
	  			})
	  			.catch(error => console.error(error));

		});
	}

	feed(screenshots){
		this.app.get('/', (request, response) => {
			response.json(screenshots);
		});
	}

	stop(){
		console.log(`Stopping HTTP Server`);
		this.server.close(() => {
			console.log(`Server Closed.`);
		});
		this.server = null;
	}

}

module.exports = Server;