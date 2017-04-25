const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const settings = require('../settings'); 

class Screenshots {

	constructor(){
		this.validExtensions = ['.jpg', '.png'];
		this.searchDirectories = settings.directories; 
	}

	list(){
		return Promise.resolve(this.get());
	}

	get(){
		return this.scan(this.searchDirectories)
				 .then(screenshots => screenshots[0])
				 .catch(error => console.error(error));
	}

	scan(directories){
		return Promise.resolve(directories.map(dir => this.walkSync(dir)));
	}

	walkSync(dir, filelist=[]) {
	  let files = fs.readdirSync(dir);
	  files.forEach(file => {
	    if (fs.statSync(dir+'/'+file).isDirectory()) {
	      filelist = this.walkSync(dir+'/'+file, filelist);
	    }else{
	      	if(this.validExtensions.includes(path.extname(file))){
	      		let filepath = path.resolve(dir+'/'+file);
	      		filelist.push({id: uuid.v4(filepath), path: filepath});;	
			}
	    }
	  });
	  let unique = [...new Set(filelist)];
	  return unique;
	}

}

module.exports = Screenshots;