
var react       = require('react')
var inject      = require('connect-inject')
var path        = require('path')
var fs          = require('fs')

exports = module.exports = loader = {

    list : [],

    initJSX : function(){
        return require('node-jsx').install();
    },

    engine : function (filePath, options, callback){
        delete require.cache[require.resolve(filePath)]
        delete options['settings']
        

        var client = require(filePath)
        var clientApp = react.createFactory(client)(options)
        var name = client.displayName;
        var markup = react.renderToString(clientApp);

        var props = '<script type="application/json" id="props_'+name+'">'+JSON.stringify(options)+'</script>'
        markup = '<html>' + props + markup +'</html>';

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