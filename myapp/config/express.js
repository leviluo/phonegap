var express = require('express');
var bodyParser = require('body-parser');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');

var morgan = require("morgan");
module.exports = function() {
    console.log('init express...');
    var app = express();

    app.use(bodyParser.json());

    app.use(express.static('./public/www'));

    app.use(morgan("dev"));

    // app.use(cookieParser());
    // app.use(session({
    //     cookie: { maxAge: 1800000 },
    //     resave: false, // don't save session if unmodified
    //     saveUninitialized: true, // don't create session until something stored
    //     secret: 'leviluo'
    // }));

    app.use(bodyParser({ uploadDir: './upload' }));

    require('../app/routes/user.server.routes')(app);

    //设置跨域访问
    app.all('*', function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });

   

    app.use(function(req, res, next) {
        res.status(404);
        try {
            return res.json('Not Found')
        } catch (e) {
            console.log('404 set header after sent');
        }
    });

    app.use(function(err, req, res, next) {
        if (!err) {
            return next()
        };
        res.status(500);
        try {
            return res.json(err.message || 'server error')
        } catch (e) {
            console.log('500 set header after sent');
        }

    })

    return app;
}
