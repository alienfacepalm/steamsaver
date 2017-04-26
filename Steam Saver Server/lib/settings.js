const Datastore = require('nedb');
const path = require('path');

class Settings {

	constructor(userDataPath){
		this.settings = new Datastore({filename: path.resolve(userDataPath+'/settings.db'), autoload: true});	
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
