
This is a library for allowing server and client side rendering of react components.

    npm install react-view-engine --save

then in your express ```app.js```

    var engine = require('react-view-engine');

    // Use this function to initialize node-jsx, if your react files are .jsx
    engine.initJSX()
    //Or use Babel-register
    // require('babel-register')({extensions: ['js', 'jsx']})

    app.engine('js', engine.engine);
    
    // Normal express view stuff
    app.set('views', path.join(__dirname, 'public', 'javascripts'));
    app.set('view engine', 'jsx');
    app.set('view', engine.view)
from then on you can use the normal ```res.render``` function of express.

The react view must be loaded normally to the clientside somewhere.

In your react app you must add the ```loadProps(View, layout)``` function to the global object if you want to load the view props on the clientside.

    /**
     * @jsx React.DOM
     * client-app.jsx
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



    /**
     * app.jsx
    */
    var ClientApp = require('./client-app');
    var layout = require('./layout');
    var ReactDOM = require('react-dom');
    var React = require('react');

    function loadProps(name, layout){
        var rootComponent = require('./'+name);
        ReactDOM.render(<rootComponent />, document)
    }
