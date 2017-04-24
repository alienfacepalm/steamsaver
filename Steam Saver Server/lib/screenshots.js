const fs = require('fs');
const path = require('path');

class Screenshots {

	constructor(){
		//TODO: store list of paths in local db
		this.validExtensions = ['.jpg', '.png'];
		this._screenshots = [];
		this.searchDirectories = ['G:\\Games\\userdata\\64952127\\760\\remote'];
	}

	get screenshots(){
		return this._screenshots;
	}

	initialize(){
		this.scan(this.searchDirectories).then(screenshots => {
			this._screenshots = screenshots;
		}).catch(error => console.error(error));
	}

	scan(directories){
		return Promise.resolve(directories.map(dir => this.walkSync(dir)));
	}

	walkSync(dir, filelist=[]) {
	  let files = fs.readdirSync(dir);
	  files.forEach(file => {
	    if (fs.statSync(dir + '/' + file).isDirectory()) {
	      filelist = this.walkSync(dir + '/' + file, filelist);
	    } else {
	      	if(this.validExtensions.includes(path.extname(file))){
				filelist.push(path.resolve(file));
			}
	    }
	  });
	  return filelist;
	}

}

module.exports = Screenshots;