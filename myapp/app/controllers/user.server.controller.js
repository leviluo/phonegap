var mongoose = require('mongoose');
// var News = mongoose.model('News');
var User = mongoose.model('User');

module.exports = {
  //   create: function(req, res, next){
  //   var news = new News(req.body);
  //   news.save(function(err){
  //     if(err) return next(err);
  //     return res.json(news);
  //   });
  // },

register: function(req, res, next){
  console.log('post data');
  console.log(req.body);
    var user = new User(req.body);
    user.save(function(err){
      if(err) return next(err);
      return res.json(user);
    });
  },

     // 获取列表
  // list: function(req, res, next){
  //   // 对于这两个参数，还需要思考，如果用户传入负数怎么办
  //   var pagesize = parseInt(req.query.pagesize, 10) || 10;
  //   var pagestart = parseInt(req.query.pagestart, 10) || 1;

  //   News
  //   .find()
  //   // 搜索时，跳过的条数
  //   .skip( (pagestart - 1) * pagesize )
  //   // 获取的结果集条数
  //   .limit( pagesize)
  //   .exec(function(err, docs){
  //     if(err) return next(err);

  //     return res.json(docs);
  //   });
  // },


  //   getById: function(req, res, next, id) {
  //       if (!id) {
  //           return next(new Error('News not found')) 
  //       };
  //       News.findOne({ _id: id })
  //           .exec(function(err, doc) {
  //               if (err) {
  //                   return next(err);
  //               };
  //               if (!doc) {
  //                   return next(new Error('News not found')) };

  //               req.news = doc;
  //               return next();
  //           })
  //   },
  //   get: function(req, res, next) {
  //         return res.json(req.  )
  //   }
}
