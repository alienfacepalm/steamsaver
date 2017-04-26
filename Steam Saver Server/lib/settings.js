const Datastore = require('nedb');
const path = require('path');

let instance;

class Settings {

	constructor(userDataPath){
		if(!instance){
			instance = this;
		}
		this._userDatapath = userDataPath;
		this.settings = new Datastore({filename: path.resolve(userDataPath+'/settings.db'), autoload: true});	

		return instance;
	}

	get(){
		return new Promise((resolve, reject) => {
			this.settings.findOne({}, (error, doc) => {
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
	}

	addDirectory(directory){
		//$addToSet the new directory (won't add multiples of same)
	}

	removeDirectory(id){
		//$pull
	}

	save(settings){
		return new Promise((resolve, reject) => {
			this.settings.insert(settings, (error, doc) => {
				if(error){
					reject(error);
				}else{
					resolve(doc);
				}
			});
		});
	}

}

module.exports = Settings;
