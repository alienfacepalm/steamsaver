const fs = require('fs');
const path = require('path');

class Screenshots {

	constructor(){
		this.validExtensions = ['.jpg', '.png']; //TODO: configurable
		this.searchDirectories = ['G:\\Games\\userdata\\64952127\\760\\remote'];  //TODO: configurable
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
				filelist.push(path.resolve(file));
			}
	    }
	  });
	  let unique = [...new Set(filelist)];
	  return unique;
	}

}

module.exports = Screenshots;