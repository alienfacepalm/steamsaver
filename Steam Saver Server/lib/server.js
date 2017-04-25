const {ipcMain} = require('electron');
const express = require('express');
const fs = require('fs');
const ip = require('ip');

const Screenshots = require('./screenshots');

let instance = null;

class Server {

	constructor(port, win){
		if(!instance){
			instance = this;
		}
		this.PORT = port;
		this.app = null;
		this.server = null;
		this.screenshots = [];

		return instance;
	}

	get running(){
		return this.server ? true : false;
	}

	initialize(win){
		this.start();
	}

	start(){
		console.log(`Starting HTTP Server`);

		this.app = express();

		this.server = this.app.listen(this.PORT || 10003, () => {
			console.log(`SteamSaver Server is running on ${this.PORT}`);

			let screenshots = new Screenshots;
  			screenshots.list()
	  			.then(screenshots => {
	  				this.screenshots = screenshots;
	  				this.feed();
	  			})
	  			.catch(error => console.error(error));
		});
	}

	feed(){
		this.app.get('/:uuid?', (request, response) => {
			let uuid = request.params.uuid;
			if(uuid){
				try{
					let file = this.screenshots.filter(screenshot => screenshot.id === uuid);
					fs.readFile(file[0].path, (error, buffer) => {
						response.writeHead(200, {"Content-Type": "image/jpeg"});
						response.end(buffer, 'binary');
					});
				}catch(error){
					response.writeHead(404);
					response.end("File Not Found");
				}
			}else{
				//serve the list
				response.json(this.screenshots);
			}
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