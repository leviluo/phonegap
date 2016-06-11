var UserController = require('../controllers/user.server.controller');

module.exports = function(app) {
// app.route('/news')
// .get(NewsController.list).post(NewsController.create);

// app.route('/news/:nid').get(NewsController.get);

app.route('/user/register').post(UserController.register)
app.route('/user/login').post(UserController.login)
app.route('/activity/publish').post(UserController.ensureAuthorized,UserController.publish)

app.route('/images/upload').post(UserController.image_upload)


// app.param('nid',NewsController.getById);
}