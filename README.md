
This is a library for allowing server and client side rendering of react components.

    npm install react-view-engine --save

then in your express ```app.js```

    var engine = require('./react-view-engine');

    //Use this function to initialize node-jsx, if your react files are .jsx
    engine.initJSX()

    app.engine('js', engine.engine);
    app.use(engine.handler);

from then on you can use the normal ```res.render``` function of express.

The react view must be loaded normally to the clientside somewhere.

In your react view you must add the ```loadProps(View, View.displayName)``` if you want to load the view props on the clientside.

    /**
     * @jsx React.DOM
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

    if(typeof window != "undefined"){
      window.addEventListener('load', function(){
        loadProps(ClientApp, ClientApp.displayName)
      })
    }
