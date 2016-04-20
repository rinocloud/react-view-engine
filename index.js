
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
        "  var props = JSON.parse(document.getElementById('props_" + name + "').innerHTML)",
        "  loadProps('" + name + "', '" + layout + "', props)",
        "})",
        '</script>'
    ].join('\n')
    return html.replace('</body>', script + '</body>')

}

module.exports = function engine(l) {
  var layout = l
  require('babel-register')({
    extensions: ['.jsx', '.js'],
    sourceMaps: true
  })
  return function (filePath, options, callback) {
    try {
      delete require.cache[require.resolve(filePath)]
      if (layout) {
        var layoutPath = this.lookup(layout + ".jsx")
        delete require.cache[require.resolve(layoutPath)]
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
      markup = '<!DOCTYPE html>' + handler(markup, name, options, layout)
      return callback(null, markup)
    }catch(error){
      return callback(error)
    }
  }
}