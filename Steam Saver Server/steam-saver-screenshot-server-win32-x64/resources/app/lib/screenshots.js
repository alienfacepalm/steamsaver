const fs = require('fs');
const path = require('path');

const directories = require('../directories'); 

class Screenshots {

	constructor(){
		this.validExtensions = ['.jpg', '.png'];
		this.searchDirectories = directories; 
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
				filelist.push(path.resolve(dir+'/'+file));
			}
	    }
	  });
	  let unique = [...new Set(filelist)];
	  return unique;
	}

}

module.exports = Screenshots;