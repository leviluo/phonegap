angular.module('starter.services', [])
    .factory('HttpService', function($http) {
        var Service = {};
        Service.postdata = function(url, data1) {
            return $http({
                method: 'POST',
                url: url,
                data: data1,
            })
        };

        Service.getdata = function(url, params) {
            return $http({
                method: 'GET',
                url: url,
                params: params, // pass in data as strings  
            })
        };

        return Service;
    })
    .factory("storeService", function($parse) {

        aaaa = {};

        var privateMethods = {
            parseValue: function(res) {
                var val;
                try {
                    val = JSON.parse(res);
                    if (typeof val == 'undefined') {
                        val = res;
                    }
                    if (val == 'true') {
                        val = true;
                    }
                    if (val == 'false') {
                        val = false;
                    }
                    if (parseFloat(val) == val && !angular.isObject(val)) {
                        val = parseFloat(val);
                    }
                } catch (e) {
                    val = res;
                }
                return val;
            }
        };

        aaaa.publicMethods = function(StorageType) {

            var ssss = {};

            if (StorageType == 'localStorage') {
                var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
                // console.log('localStorage');
            } else {
                var storage = (typeof window.sessionStorage === 'undefined') ? undefined : window.sessionStorage;
                // console.log('sessionStorage');
            }

            supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');

            ssss.set = function(key, value) {
                    if (!supported) {
                        try {
                            $.cookie(key, value);
                            return value;
                        } catch (e) {
                            console.log('Local Storage not supported, make sure you have the $.cookie supported.');
                        }
                    }
                    var saver = JSON.stringify(value);
                    storage.setItem(key, saver);
                    return privateMethods.parseValue(saver);
                },
                ssss.get = function(key) {
                    if (!supported) {
                        try {
                            return privateMethods.parseValue($.cookie(key));
                        } catch (e) {
                            return null;
                        }
                    }
                    var item = storage.getItem(key);
                    return privateMethods.parseValue(item);
                },
                ssss.remove = function(key) {
                    if (!supported) {
                        try {
                            $.cookie(key, null);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                    storage.removeItem(key);
                    return true;
                },
                ssss.bind = function($scope, key, def) {
                    def = def || '';
                    if (!publicMethods.get(key)) {
                        publicMethods.set(key, def);
                    }
                    $parse(key).assign($scope, publicMethods.get(key));
                    $scope.$watch(key, function(val) {
                        publicMethods.set(key, val);
                    }, true);
                    return publicMethods.get(key);
                }
            return ssss;
        };
        return aaaa;
    })
    .factory('AuthInterceptor', function($rootScope,storeService,$q) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if (storeService.publicMethods('localStorage').get('token')) {
                    config.headers.Authorization = 'Bearer ' + storeService.publicMethods('localStorage').get('token');
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.$state.go('login');
                }
                return $q.reject(response);
            }
        };
    })
