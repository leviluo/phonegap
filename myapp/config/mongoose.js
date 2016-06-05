var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){
	var db = mongoose.connect(config.mongodb)

	require('../app/models/user.server.model');

	return db; 
}