
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var inject = require('connect-inject')
var path = require('path')
var fs = require('fs')
var layout
var View = require('./view')

function getComponent(file){
    var r = require(file);
    if(r.__esModule && r.default){
        return r.default
    } else {
        return r
    }
}

function cleanOptions(options){
    var opts = options
    delete opts['settings']
    delete opts['_locals']
    delete opts['_csrf']
    delete opts['enrouten']
    delete opts['cache']
    return opts
}


function handler(html, name, options){
    var script = [
        '<script type="application/json" id="props_'+name+'">',
            JSON.stringify(options),
        '</script>',
        '<script>',
        "window.addEventListener('load', function(){",
        "    var props = JSON.parse(document.getElementById('props_" + name + "').innerHTML)",
        "    loadProps('" + name + "', '"  + layout + "', props)",
        "})",
        '</script>'
    ].join('\n')
    return html.replace('</body>', script + '</body>')
    
}

exports = module.exports = loader = {
    setLayout: function(l) { layout = l },
    list : [],
    view: View,
    initJSX : function(){
        return require('node-jsx').install();
    },

    engine : function (filePath, options, callback){
        delete require.cache[require.resolve(filePath)]
        
        if(layout){
            var layoutPath = this.lookup(layout+".jsx")
            delete require.cache[require.resolve(layoutPath)]
            var Layout = getComponent(layoutPath)
        }
        
        var client = getComponent(filePath)
        
  	if(options.noHashes){
		var render = ReactDOMServer.renderToStaticMarkup
	} else {
		var render = ReactDOMServer.renderToString
	}

        var name = this.name
        var data = cleanOptions(options)
        var clientApp = React.createFactory(client)(data)
        var Template = Layout ? React.createFactory(Layout)(data, clientApp) : clientApp
        var markup = render(Template)
        markup = '<!DOCTYPE html>' + handler(markup, name, options)

        return callback(null, markup)
    }

}
