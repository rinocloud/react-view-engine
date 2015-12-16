var path = require('path')
module.exports = function(name, options){
	
	options.path = path.join(options.root, name)
	this.path = options.path
        this.root = options.root
	this.defaultEngine = options.defaultEngine
	this.engines = options.engines
	return options
}
module.exports.prototype.render = function(options, callback){
	this.defaultEngine(this.path, options, callback)
}
