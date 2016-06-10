    angular.module('starter.controllers', [])

    .controller('initCtrl', function($rootScope, $scope, storeService, $http, $ionicPopup) {

            var pictureSource; // picture source
            var destinationType; // sets the format of returned value

            $rootScope.babyThingsApp = {

                initialize: function() {
                    this.bindEvents();
                },

                bindEvents: function() {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                },

                //只有真机才会有效果，模拟器没有
                onDeviceReady: function() {
                    pictureSource = navigator.camera.PictureSourceType;
                    destinationType = navigator.camera.DestinationType;
                    // capture = navigator.device.capture;

                    try {
                        if (window.device.version.substr(0, 1) === '7') {
                            //$('body').addClass('ios7');
                        }
                    } catch (e) {};

                    $rootScope.babyThingsApp.receivedEvent('deviceready');
                },

                receivedEvent: function(id) {

                },

                //添加local notification
                addNotification: function(remindId, title, msg, timestamp) {

                    //注意避免浏览器测试的 cannot read property ”xxxxx" of undefined错误
                    if (window.plugin && window.plugin.notification && window.plugin.notification.local) {
                        window.plugin.notification.local.promptForPermission();

                        window.plugin.notification.local.hasPermission(function(granted) {
                            console.log('Permission has been granted: ' + granted);

                            //先判断是否需要删除
                            //            window.plugin.notification.local.isScheduled(remindId, function (isScheduled) {
                            //                // console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
                            //                window.plugin.notification.local.cancel(remindId);
                            //            });

                            window.plugin.notification.local.add({
                                id: remindId,
                                title: title,
                                msg: msg,
                                //repeat:  'weekly',
                                date: new Date(timestamp)
                            });

                        });
                    }

                },

                //删除某个local notification
                cancelNotification: function(remindId) {
                    if (window.plugin && window.plugin.notification && window.plugin.notification.local) {
                        window.plugin.notification.local.isScheduled(remindId, function(isScheduled) {
                            // console.log('Notification with ID ' + id + ' is scheduled: ' + isScheduled);
                            window.plugin.notification.local.cancel(remindId);
                        });
                    }
                },

                //删除所有调度
                cancelAllNotification: function() {
                    if (window.plugin && window.plugin.notification && window.plugin.notification.local) {
                        window.plugin.notification.local.cancelAll();
                    }
                },

                //正在被调度的提醒
                getScheduledIds: function() {
                    if (window.plugin && window.plugin.notification && window.plugin.notification.local) {
                        window.plugin.notification.local.getScheduledIds(function(scheduledIds) {
                            alert('Scheduled IDs: ' + scheduledIds.join(' ,'));
                        });
                    }
                },

                //拍照
                capturePhoto: function() {
                    if (navigator.camera && navigator.camera.getPicture) {
                        navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, {
                            quality: 600,
                            destinationType: destinationType.FILE_URI,
                            targetWidth: 800,
                            targetHeight: 640
                        });
                    }
                },

                //从图库选取
                getPhotoFromLibrary: function() {
                    if (navigator.camera && navigator.camera.getPicture) {
                        navigator.camera.getPicture(this.onPhotoURISuccess, this.onFail, {
                            quality: 600,
                            destinationType: destinationType.FILE_URI,
                            sourceType: pictureSource.PHOTOLIBRARY,
                            targetWidth: 800,
                            targetHeight: 640
                        });
                    }
                },

                startRecordAudio: function() {
                    // alert('o11k');
                    navigator.device.capture.captureAudio(this.captureSuccess, this.captureError, { limit: 1, duration: 10 });

                },

                captureSuccess: function(mediaFiles) {
                    storeService.publicMethods('sessionStorage').set('mediaFiles', mediaFiles);
                    // alert(mediaFiles[0].name);
                    $scope.$broadcast('audio', mediaFiles[0].name);
                },

                // Called if something bad happens.
                //
                captureError: function(error) {
                    var msg = 'An error occurred during capture: ' + error.code;
                    navigator.notification.alert(msg, null, 'Uh oh!');
                },


                //
                onPhotoURISuccess: function(imageURI) {

                    var i = 1;
                    var j = 'Pic' + i;

                    while (document.getElementById(j).width != '0') {
                        // alert(j);
                        i++;
                        if (i > 6) {
                            $ionicPopup.alert({
                                title: '消息提示',
                                template: '只能上传6张图片'
                            }).then(function() {
                                return;
                            });
                            return;
                        };
                        j = 'Pic' + i;
                    };

                    document.getElementById(j).style.width = '40%';
                    // alert(document.getElementById(j).width);
                    var imgElement = document.getElementById(j);

                    imgElement.src = imageURI;

                },

                getLocation: function() {
                    navigator.geolocation.getCurrentPosition(this.getLocationonSuccess, this.getLocationonError);
                },

                //  获取位置信息成功时调用的回调函数
                //  该方法接受一个“Position”对象，包含当前GPS坐标信息
                getLocationonSuccess: function(position) {
                    $http.jsonp("http://api.map.baidu.com/geocoder/v2/?ak=W6TiQkinV02e8UGbIPFqEZMzwWB3e797&callback=JSON_CALLBACK&location=" + position.coords.latitude + "," + position.coords.longitude + "&output=json&pois=1").success(function(data) {　
                        storeService.publicMethods('sessionStorage').set('location', data.result.formatted_address);
                        storeService.publicMethods('sessionStorage').set('location_city', data.result.addressComponent.city);
                        // alert(data.result.formatted_address);
                        // alert(data.result.addressComponent.city);

                    }).error(function(data) {
                        // alert(data);
                    });
                },

                // onError回调函数接收一个PositionError对象
                getLocationonError: function(error) {
                    alert('code: ' + error.code + '\n' +
                        'msg: ' + error.msg + '\n');
                },

                //拍照失败回调
                onFail: function(msg) {
                    var alertPopup = $ionicPopup.alert({
                        title: '获取图片失败',
                        template: ""
                    });
                    alertPopup.then(function(res) {
                        console.log('close image error');
                    });
                }

            };

            $rootScope.babyThingsApp.initialize();
            $rootScope.babyThingsApp.getLocation();

        })
        .controller('RegisterCtrl', function($scope, $ionicPopup, $state, $state, storeService, HttpService) {

            $scope.submit = function(formdata) {

                // HttpService.postdata('http:192.168.2.121:50000/user/register', formdata).success(function(data) {
                HttpService.postdata('user/register', formdata).success(function(data) {

                    $ionicPopup.alert({
                        title: '消息提示',
                        template: data.msg
                    }).then(function() {
                        if (data.id == 0) {
                            storeService.publicMethods('localStorage').set('phone', formdata.phone);
                            storeService.publicMethods('localStorage').set('token', data.token);
                            $state.go('tab.activity');
                        }
                    })
                }).error(function(data) {
                    console.log(data);
                })
            }
        })
        .controller('LoginCtrl', function($scope, $ionicPopup, storeService, $state, HttpService) {
            $scope.submit = function(formdata) {
                // HttpService.postdata('http:192.168.2.121:50000/user/login', formdata).success(function(data) {
                HttpService.postdata('user/login', formdata).success(function(data) {
                    $ionicPopup.alert({
                        title: '消息提示',
                        template: data.msg
                    }).then(function() {
                        if (data.id == 0) {
                            storeService.publicMethods('localStorage').set('phone', formdata.phone);
                            storeService.publicMethods('localStorage').set('token', data.token);
                            $state.go('tab.activity');
                        }
                    })
                }).error(function(data) {
                    alert(data);
                })
            }
        })
        .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

            // Called to navigate to the main app
            $scope.startApp = function() {
                $state.go('login');
            };
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };
            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };
            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
                console.log(index);
            };
        })
        .controller('activityCtrl', function($scope, storeService, HttpService) {
            $scope.territory = "同城";
            $scope.activitys = [];
            var location = (storeService.publicMethods('sessionStorage').get('location_city') == undefined) ? '' : storeService.publicMethods('sessionStorage').get('location_city');
            // alert(location);
            $scope.doRefresh = function() {
                HttpService.getdata('http:192.168.2.121:50000/activity/getactivity', { location: '' }).success(function(data) {
                    var titles = {};
                    $scope.images = {};
                    var array = [];
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].url) {
                            array.push('./' + data[i].url);
                            $scope.images[data[i].id] = array;
                        };
                        if (titles.hasOwnProperty(data[i].id)) {
                            continue;
                        }
                        titles[data[i].id] = data[i].id;
                        $scope.activitys.push(data[i]);
                    };
                })
            }
        })

    .controller('interestCtrl', function() {



    })

    .controller('msgsCtrl', function() {



        }).controller('myCtrl', function() {



        })
        .controller('personal_msgCtrl', function() {



        })
        .controller('group_msgCtrl', function() {



        })
