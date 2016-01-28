var path = require('path')
function View(name, options){
	Object.assign(this, options)
    
    var ext = path.extname(name)
    
    if(options.engines[ext]){
        this.engine = this.engines[ext]
    } else {
        this.engine = this.engines['.jsx']
    }
    
	if(typeof options.root === 'string') {
		options.path = path.join(options.root, name)
	}else{
        for(var path in options.root){
            var loc = path.resolve(path, name);
            var dir = path.dirname(loc);
            var file = path.basename(loc);
            if(this.resolve(dir, file)){
                options.path = this.resolve(dir, file)
                break
            }
        }
	}
	//this.path = options.path
        //this.root = options.root
	//this.defaultEngine = options.defaultEngine
	//this.engines = options.engines
//	return options
}
View.prototype.render = function(options, callback){
	this.engine(this.path, options, callback)
}
module.exports = View
