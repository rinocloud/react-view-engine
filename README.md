
This is a express view engine for allowing server rendering of react components.

#Installation
```
    npm install react-view-engine --save
```
If you do not have a .babelrc file, create and set react in a .babelrc file

```
echo '{"presets": ["react", "es2015", "stage-0"]}' > .babelrc

```

#Usage

```js
    /**
     * app.js
     */
    var ReactEngine = require('react-view-engine')
    app.engine('jsx', ReactEngine(/*options?*/))    //set jsx files to use ReactEngine
    app.engine('jade', require('jade').__express)   //Still can use other engines if needed.
    app.set('view engine', 'jsx')                   //Set defaut view extension to be jsx
    app.set('views', [
      __dirname + '/components',                    //jsx view folder
      __dirname + '/public/views'                   //jade view folder
    ])
```
After this you can use ```res.render``` function from express to render jsx.

```js
    app.get('/', function index(req, res) {
      res.render('client-app', { name: 'Joel' })    //render(<react file>, <initial props>)
    }
```
Will render the View...

```js
    /**
     * components/client-app.jsx
    */

    var React = require('react');

    var ClientApp = React.createClass({
      render: function() {
        return (
          <html>
            <head>
              <script src="/js/client.js"/>
            </head>
            <body>
              <h1>{this.props.name}</h1>
            </body>
          </html>
        );
      }
    });

    module.exports = ClientApp;

```

In order to get inital props on client side `loadProps(View, props, layout)` is called (after `DOMContentLoaded` has been fired).
Set this function on the global state if you wish mount your react component clientside.

```js
    /**
     * components/app.jsx
     * Entry point for bundler
    */
    var ClientApp = require('./client-app'); //require the views you will render serverside for the bundler.
    var ReactDOM = require('react-dom');
    var React = require('react');

    function loadProps(name, props, layout){
        var rootComponent = require('./'+name);
        ReactDOM.render(<rootComponent {...props} />, document)
    }
```

#Options

`layout`: A component to wrap all your components with. 
  This in nice if you do not want to write `<html>` tags in all of your views. 
  The same props object will be given to both your layout and your View component.

`extension`: file extensions for babel-register to use. Default is `['.js', '.jsx']`

`doctype`: the `<!DOCTYPE>` you wish to be set. Default is `<!DOCTYPE html>`

#Warning
In large systems the first page view will be slow because babel is parsing it. After the view is cached in `requre.cache` the page renders faster. If you run multiple instances of express and load-manage, please force a page load after deploy on each to initially build.