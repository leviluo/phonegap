var express = require('express');
var bodyParser = require('body-parser')
module.exports = function() {
    console.log('init express...');
    var app = express();

    app.use(bodyParser.json());

    app.use(express.static('./public/www'));

    require('../app/routes/user.server.routes')(app);

    //设置跨域访问
    // app.all('*', function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("X-Powered-By", ' 3.2.1')
    //     res.header("Content-Type", "application/json;charset=utf-8");
    //     next();
    // });


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
