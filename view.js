var path = require('path')
module.exports = function(name, options){
	
	options.path = path.join(options.root, name)
	this = options
	return options
}
