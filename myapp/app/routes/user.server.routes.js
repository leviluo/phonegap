var UserController = require('../controllers/user.server.controller');

module.exports = function(app) {
// app.route('/news')
// .get(NewsController.list).post(NewsController.create);

// app.route('/news/:nid').get(NewsController.get);

app.route('/user/register').post(UserController.register)
app.route('/user/login').post(UserController.login)
app.route('/activity/publish').post(UserController.ensureAuthorized,UserController.activity_publish)
app.route('/activity/get/:location').get(UserController.activity_get)
app.param('location',UserController.activity_location);
app.route('/images/upload').post(UserController.ensureAuthorized,UserController.image_upload)
app.route('/upload/images/:name').get(UserController.activity_get)
app.param('name',UserController.image_get);

// 
// app.route('/images/upload/:uuid').post(UserController.image_upload)
// app.param('nid',NewsController.getById);
}
