const {ipcMain} = require('electron');
const express = require('express');
const fs = require('fs');
const ip = require('ip');
const path = require('path')

const Screenshots = require('./screenshots');
const Settings = require('./settings');

let instance = null;

class Server {

	constructor(app, port){
		if(!instance){
			instance = this;
		}
		this.port = port;
		this.app = app;
		this.expressApp = null;
		this.server = null;
		this.screenshots = [];
		this.settings = null;

		return instance;
	}

	get running(){
		return this.server ? true : false;
	}

	initialize(){
		this.start();

		//Store settings document in neDB
		
		this.settings = new Settings(this.app.getPath('userData'));
		/*
		this.settings.save({port: 10003, directories: [
			path.resolve('G:/Games/userdata/64952127/760/remote'),
			path.resolve('X:/Pictures')
		]})
		.then(settings => console.log(settings._id, 'saved!'));
		*/
		let settings = this.settings.get().then(settings => console.log(`Settings From DB`, settings));
	}

	start(){
		console.log(`Starting HTTP Server`);

		this.expressApp = express();

		this.server = this.expressApp.listen(this.port || 10003, () => {
			console.log(`SteamSaver Server is running on ${this.port}`);

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
		this.expressApp.get('/:uuid?', (request, response) => {
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