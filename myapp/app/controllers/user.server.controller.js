var express = require('express');
var app = express();
var mongoose = require('mongoose');
// var News = mongoose.model('News');
var User = mongoose.model('User');
var Activity = mongoose.model('Activity');
var Images = mongoose.model('Image');
var jwt = require("jsonwebtoken");
var config = require('../../config/config');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
module.exports = {
    //   create: function(req, res, next){
    //   var news = new News(req.body);
    //   news.save(function(err){
    //     if(err) return next(err);
    //     return res.json(news);
    //   });
    // },

    register: function(req, res, next) {
        // console.log(req.body);
        if (!req.body.phone || !req.body.code || !req.body.password) {
            return res.json({ 'id': -10, 'msg': '表单不完整' });
        };
        User.findOne({ phone: req.body.phone }, function(err, docs) {
            if (!err) {
                if (docs) {
                    return res.json({ 'id': -12, 'msg': '该手机号已注册' });
                } else {
                    var user_model = new User(req.body);
                    user_model.save(function(err, user) {
                        if (err) return next(err);
                        console.log(typeof user.password);
                        console.log(user);
                        user.token = jwt.sign(user, config.JWT_SECRET);
                        user.save(function(err, user1) {
                            res.json({
                                id: 0,
                                msg: "注册成功",
                                token: user1.token
                            });
                        });
                    });
                }
            } else {
                return next(err);
            }
        });
    },

    login: function(req, res, next) {
        console.log('login:' + req.body);
        if (!req.body.phone || !req.body.password) {
            return res.json({ 'id': -10, 'msg': '表单不完整' });
        };
        User.findOne({ phone: req.body.phone, password: req.body.password }).exec(function(err, docs) {
            if (!err) {
                if (docs) {
                    //登录session
                    return res.json({ 'id': 0, 'msg': '登录成功', token: docs.token });
                } else {
                    return res.json({ 'id': -11, 'msg': '用户不存在' });
                }
            } else {
                return next(err);
            }
        });
    },


    activity_publish: function(req, res, next) {
        for (key in req.body) {
            console.log(key + ":" + req.body[key]);
        }
        // console.log(req.token);
        User.findOne({ _id: req.userid }, function(err, docs) {
            if (err) return next(err);
            if (docs) {
                req.body.user = req.userid;
                var activity = new Activity(req.body);
                activity.save(function(err, docs) {
                    if (err) return next(err);
                    return res.json({ 'id': 0, 'msg': '发布成功' })
                })
            } else {
                return res.json({ 'id': -11, 'msg': '用户不存在' })
            }
        })
    },

    activity_get:function(req,res,next){
         return res.json(req.data);
    },

    activity_location:function(req,res,next,location){
        Activity.find(function(err, docs) {
            if (err) return next(err);
            if (docs) {
                req.data = docs;
                next();
            } else {
                return res.json({ 'id': -11, 'msg': '没有更新' })
            }
        })
    },

    ensureAuthorized: function(req, res, next) {
        console.log("进入认证")
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            // console.log('111'+req.token);
            req.userid = jwt.decode(req.token, config.JWT_SECRET)._doc._id;
            if (!req.userid) {
                return res.json({ "id": "-10", "msg": "用户不存在" });
            }
            next();
        } else {
            res.send(403);
        }
    },

    image_upload: function(req, res, next) {
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({ uploadDir: './upload/images/' });
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);
            if (err) {
                console.log('parse error: ' + err);
            } else {
                User.findOne({ _id: req.userid }, function(err, docs) {
                    if (err) return next(err);
                    if (docs) {
                        var inputFile = files.file[0];
                        var uploadedPath = inputFile.path;
                        var dstPath = './upload/images/' + inputFile.originalFilename;

                        // Activity.findOne({ uuid: fields.uuid.toString() }, function(err, docs) {
                        //     if (err) {
                        //         console.log(err);
                        //         return next(err);
                        //     }
                        //     console.log('信息保存成功');

                        //重命名为真实文件名
                        fs.rename(uploadedPath, dstPath, function(err) {
                            if (err) {
                                console.log('rename error: ' + err);
                            } else {
                                Activity.update({ uuid: fields.uuid.toString() }, { $push: { images: dstPath } }, function(err, docs) {
                                    if (err) {
                                        console.log(err);
                                        return next(err);
                                    }
                                    console.log('信息保存成功');
                                })
                            }
                        });
                        // })
                    } else {
                        return res.json({ 'id': -11, 'msg': '用户不存在' })
                    }
                })
            }
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
    //         return res.json(req.news)
    //   }
}
