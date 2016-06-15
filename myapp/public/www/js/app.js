angular.module('ionicApp', ['ionic', 'directive', 'publishcontrollers', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        console.log(toState.url);
    })
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    //angularjs默认的json格式，要按formdata格式传送
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    //   var param = function(obj) {
    //   var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    //   for(name in obj) {
    //     value = obj[name];

    //     if(value instanceof Array) {
    //       for(i=0; i<value.length;i++){
    //         subValue = value[i];
    //         fullSubName = name + '[' + i + ']';
    //         innerObj = {};
    //         innerObj[fullSubName] = subValue;
    //         query += param(innerObj) + '&';
    //       }
    //     }
    //     else if(value instanceof Object) {
    //       for(subName in value) {
    //         subValue = value[subName];
    //         fullSubName = name + '[' + subName + ']';
    //         innerObj = {};
    //         innerObj[fullSubName] = subValue;
    //         query += param(innerObj) + '&';
    //       }
    //     }
    //     else if(value !== undefined && value !== null)
    //       query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    //   }

    //   return query.length ? query.substr(0, query.length - 1) : query;
    // };

    // // Override $http service's default transformRequest
    // $httpProvider.defaults.transformRequest = [function(data) {
    //   return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    // }];

    // $httpProvider.interceptors.push(['$q', '$storeService', function($q, $storeService) {
    //             return {
    //                 'request': function (config) {
    //                     config.headers = config.headers || {};
    //                     if ($storeService.publicMethod('localStorage').get('token')) {
    //                         config.headers.Authorization = 'Bearer ' + $localStorage.token;
    //                     }
    //                     return config;
    //                 },
    //                 'responseError': function(response) {
    //                     if(response.status === 401 || response.status === 403) {
    //                         $state.go('login');
    //                     }
    //                     return $q.reject(response);
    //                 }
    //             };
    //         }]);
    //         



    $httpProvider.interceptors.push([
        '$injector',
        function($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);


    $stateProvider
        .state('intro', {
            url: '/intro',
            templateUrl: 'templates/intro.html',
            controller: 'IntroCtrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })
        // Each tab has its own nav history stack:
        .state('tab.activity', {
            url: '/activity',
            views: {
                'tab-activity': {
                    templateUrl: 'templates/tab-activity.html',
                    controller: 'activityCtrl'
                }
            }
        })

    .state('tab.interest', {
            url: '/interest',
            views: {
                'tab-interest': {
                    templateUrl: 'templates/tab-interest.html',
                    controller: 'interestCtrl'
                }
            }
        })
        .state('tab.publish', {
            url: '/publish',
            views: {
                'tab-publish': {
                    templateUrl: 'templates/tab-publish.html',
                    controller: 'publishCtrl'
                }
            }
        })
        .state('tab.messages', {
            url: '/messages',
            views: {
                'tab-messages': {
                    templateUrl: 'templates/tab-messages.html',
                    controller: 'messagesCtrl'
                }
            }
        })
        .state('tab.personal_message', {
            url: '/chats/personal_message',
            views: {
                'tab-messages': {
                    templateUrl: 'templates/personal_message.html',
                }
            }
        })
        .state('tab.personal_message.personal_message_detail', {
            url: '/personal_message_detail/:chatId',
            views: {
                'tab-messages': {
                    templateUrl: 'templates/personal_message.html',
                }
            }
        })
        .state('tab.group_message', {
            url: '/chats/group_message',
            views: {
                'tab-messages': {
                    templateUrl: 'templates/group_message.html',
                }
            }
        })
        .state('tab.my', {
            url: '/my',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my.html',
                    controller: 'myCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("intro");

})
