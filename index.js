
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var path = require('path')

function getComponent(file) {
    var r = require(file);
    if (r.__esModule && r.default) {
        return r.default
    } else {
        return r
    }
}

function cleanOptions(options) {
    var opts = options
    delete opts['settings']
    delete opts['_locals']
    delete opts['_csrf']
    delete opts['enrouten']
    delete opts['cache']
    return opts
}


function handler(html, name, options, layout) {
    var script = [
        '<script type="application/json" id="props_' + name + '">',
          JSON.stringify(options),
        '</script>',
        '<script>',
        "window.addEventListener('DOMContentLoaded', function(){",
        "  if(window.loadProps){",
        "    var props = JSON.parse(document.getElementById('props_" + name + "').innerHTML);",
        "    loadProps('" + name + "', props, '" + layout + "');",
        "  }",
        "})",
        '</script>'
    ].join('\n')
    return html.replace('</body>', script + '</body>')

}

module.exports = function engine(opts) {
  opts = opts || {}
  var layout = opts.layout
  require('babel-register')({
    extensions: opts.extensions || ['.jsx', '.js'],
  })

  return function (filePath, options, callback) {
    try {
      if (layout) {
        var layoutPath = this.lookup(layout + ".jsx")
        var Layout = getComponent(layoutPath)
      }
      var client = getComponent(filePath)
      if (options.noHashes) {
        var render = ReactDOMServer.renderToStaticMarkup
      } else {
        var render = ReactDOMServer.renderToString
      }

      var name = this.name
      var data = cleanOptions(options)
      var clientApp = React.createFactory(client)(data)
      var Template = Layout ? React.createFactory(Layout)(data, clientApp) : clientApp
      var markup = render(Template)
      markup = (opts.doctype || '<!DOCTYPE html>') + handler(markup, name, options, layout)
      return callback(null, markup)
    }catch(error){
      return callback(error)
    }
  }
}