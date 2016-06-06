module.exports = function(User) {

User.sayHi = function(callback){
	callback(null,'hi');
}

User.remoteMethod('sayHi',{
	'accepts':[],
	'returns':[
		{'arg':'result','type':'string'}
	],
	'http':{
		'verb':'get',
		'path':'/say-hi'
	}
})

};
