var UserController = require('../controllers/user.server.controller');

module.exports = function(app) {
// app.route('/news')
// .get(NewsController.list).post(NewsController.create);

// app.route('/news/:nid').get(NewsController.get);

app.route('/user/register').post(UserController.register)

// app.param('nid',NewsController.getById);
}