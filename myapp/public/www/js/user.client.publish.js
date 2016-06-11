angular.module('publishcontrollers', [])
    .controller('publishCtrl', function($scope, HttpService, $state, $ionicPopup, storeService, $ionicActionSheet) {
        $scope.publish = {};
        $scope.publish.publish_territory = "0";
        $scope.publish.sex = "0";
        $scope.publish.category = "无";
        $scope.publish.location = "";
        $scope.publish.personlimits = "10000";
        $scope.publish.content = "";

        $scope.publish.location = storeService.publicMethods('sessionStorage').get('location');
        //添加照片
        $scope.showphotoes = function() {
            // 显示操作表
            $ionicActionSheet.show({
                titleText: '请选择上传方式',
                buttons: [{
                    text: '立即拍照'
                }, {
                    text: '从本地相册获取'
                }, ],
                cancelText: '取消',
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.babyThingsApp.capturePhoto();
                    } else if (index == 1) {
                        $scope.babyThingsApp.getPhotoFromLibrary();
                    }
                    return true;
                },
            });
        }

        $scope.recordAudio = function() {
            // 显示操作表
            $ionicActionSheet.show({
                titleText: '开始录音吧',
                buttons: [{
                        text: '开始录音'
                    },
                    // {
                    //     text: '暂停录音'
                    // }, {
                    //     text: '结束录音'
                    // }, 
                ],
                cancelText: '取消',
                buttonClicked: function(index) {
                    if (index == 0) {
                        // 等待加载PhoneGap
                        $scope.babyThingsApp.startRecordAudio();
                        // document.addEventListener("deviceready", onDeviceReady, false);
                    } else if (index == 1) {
                        pauseAudio();
                    } else if (index == 2) {
                        stopAudio();
                    }
                    return true;
                },
            });
        }

        $scope.$on('audio', function(data) {
            $scope.$apply(function() {
                // alert(data);
                $scope.audio = data['name'];
            })

        });
        var ss = 0;
        $scope.publishdata = function(data) {
            if (ss > 0 && ss < 180) {
                msg("发布过于频繁，请3分钟后再次发布");
                return;
            };
            var setIn = setInterval(function() {
                if (ss == 180) {
                    clearInterval(setIn);
                    ss = 0;
                };
                ss++;
            }, 1000)

            document.getElementById('publishdata').disabled = true;
            // var flag = false;
            data.phone = storeService.publicMethods('localStorage').get('phone');
            data.location_city = (storeService.publicMethods('sessionStorage').get('location_city') == undefined) ? '' : storeService.publicMethods('sessionStorage').get('location_city');

            function msg(msg) {
                $ionicPopup.alert({
                    title: '消息提示',
                    template: msg
                })
                document.getElementById('publishdata').disabled = false;

            }

            // alert(data.location_city);
            if (data.title == null || data.title.length > 40) {
                msg("标题不能为空或者标题超过了40个字符");
                ss = 0;
                return;
            };

            if (data.phone == 'undefined') {
                $ionicPopup.alert({
                    title: '消息提示',
                    template: "您还未登录，请先登录"
                })
                $state.go('login');
            };

            if (data.content.length < 10) {
                msg("介绍不能少于10位字符");
                ss = 0;
                return;
            };

            var d = new Date();
            var localOffset = Math.abs(d.getTimezoneOffset() * 60000); //-480
            var nowTime = d.getTime();
            var inputTime = new Date(data.startdate).getTime() - localOffset;

            // if (data.enddate < data.startdate) {
            //     msg("结束时间不能小于开始时间");
            //     ss = 0;
            //     return;
            // }

            // if (inputTime <= nowTime || data.enddate == undefined || data.startdate == undefined) {
            //     msg("请选择未来的时间或者未选择活动时间");
            //     ss = 0;
            //     return;
            // }

            // data.startdate1 = parseInt(Date.parse(new Date(data.startdate)) / 1000);
            // data.enddate1 = parseInt(Date.parse(new Date(data.enddate)) / 1000);

            var uuid = data.uuid = Number(new Date()) + data.phone;

            // HttpService.postdata('http:192.168.2.121:50000/activity/publish', data).success(function(data) {
            HttpService.postdata('activity/publish', data).success(function(data) {
                $ionicPopup.alert({
                        title: '消息提示',
                        template: data.msg
                    }).then(function() {
                        if (data.id == -12) {
                            $state.go('login');
                        };
                    })
                    // flag = true;
                document.getElementById('publishdata').disabled = false;
            }).error(function(data) {
                console.log(data);
            })

            // if (flag) {
            //     document.getElementById('publishdata').disabled = false;
            // };

            // 上传音频文件
            var mediaFiles = storeService.publicMethods('sessionStorage').get('mediaFiles');

            var i, len;

            if (mediaFiles) {
                for (var i = 0, len = mediaFiles.length; i < len; i += 1) {
                    var ft = new FileTransfer(),
                        path = mediaFiles[i].fullPath,
                        name = mediaFiles[i].name;
                    ft.upload(path,
                        "http:192.168.2.121:50000/audio?uuid=" + uuid,
                        function(result) {
                            // console.log('Upload success: ' + result.responseCode);
                            // console.log(result.bytesSent + ' bytes sent');
                        },
                        function(error) {
                            // console.log('Error uploading file ' + path + ': ' + error.code);
                        }, { fileName: name });
                }
                storeService.publicMethods('sessionStorage').remove('mediaFiles');
            };

            // 上传图片
            for (var i = 1; i < 7; i++) {
                var j = 'Pic' + i;
                var images = document.getElementById(j);
                if (images.width != '0') {
                    var ft = new FileTransfer(),
                        path = images.src;
                    var options = new FileUploadOptions();
                    var imagefilename = Number(new Date()) + ".jpg";
                    options.fileName = imagefilename;

                    var params = {};
                    params.uuid = uuid;
                    options.params = params;

                    ft.upload(path,
                        // "http:192.168.2.121:50001/images?uuid="+uuid,
                        "http:192.168.2.121:50000/images/upload",
                        function(result) {
                            alert('Upload success: ' + result.responseCode);
                            alert(result.bytesSent + ' bytes sent');
                        },
                        function(error) {
                            console.log('Error uploading file ' + path + ': ' + error.code);
                        }, options);
                } else {
                    break;
                }
            };
            $scope.clearPublish();
        }

        $scope.clearPublish = function() {
            for (var i = 1; i < 7; i++) {
                var j = 'Pic' + i;
                var images = document.getElementById(j);
                if (images.width != '0') {
                    images.src = "aaa";
                    images.style.width = '0';
                    // alert(images.src);
                } else {
                    break;
                }
            }
            $scope.title = '';
            $scope.content = '';
            $scope.publish.publish_territory = "0";
            $scope.publish.sex = "0";
            $scope.publish.personlimits = "10000";
            $scope.audio = '';
            storeService.publicMethods('sessionStorage').remove('mediaFiles');
        }
    })
