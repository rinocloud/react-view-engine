
var react       = require('react')
var inject      = require('connect-inject')
var path        = require('path')
var fs          = require('fs')
var layout

function import(file){
    var r = require(file);
    if(r.__esModule && r.default){
        return r.default
    } else {
        return r
    }
}
exports = module.exports = loader = {
    setLayout: function(l) { layout = l }
    list : [],

    initJSX : function(){
        return require('node-jsx').install();
    },

    engine : function (filePath, options, callback){
        delete require.cache[require.resolve(filePath)]
        
        if(layout){
            var layoutPath = path.join(options.settings.path, layout)
            delete require.cache[require.resolve(layoutPath)]
            var Layout = import(layoutPath)
        }
        
        var client = import(filePath)
        
        
        delete options['settings']
        var clientApp = react.createFactory(client)(options)
        vat Template = Layout ? Layout(options, clientApp) : clientApp
        var name = client.displayName;
        var markup = react.renderToString(Template);

        var props = '<script type="application/json" id="props_'+name+'">'+JSON.stringify(options)+'</script>'
        markup = '<!DOCTYPE html>' + markup.replace('</body>', props + '</body>')

        return callback(null, markup)
    },

    handler : function(req, res, next){
        var script = [
            '<script>',
            'window.loadProps = function(App, name){',
                'var React = require("react")',
                'var Component = React.createFactory(App);',
                'var props = JSON.parse(document.getElementById("props_" + name).innerHTML)',
                'React.render(Component(props), document);',
                'delete App',
            '}',
            '</script>'
        ].join('\n')

        return inject({snippet : script})(req, res, next)
    },

}
