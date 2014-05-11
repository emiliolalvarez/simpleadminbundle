/*angular.module('simpleadmin', ['simpleadmin.models', 'simpleadmin.filters', 'simpleadmin.controllers', 'simpleadmin.directives', 'ui', 'ngSanitize'])
    .config([
        '$httpProvider', function($httpProvider) {
            $httpProvider.defaults.headers.common['Accept'] = 'application/json';
            return $httpProvider.defaults.headers.patch = {
                'Content-Type': 'application/json;charset=utf-8'
            };
        }
    ])
    .config([
        '$interpolateProvider', function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            return $interpolateProvider.endSymbol(']]');
        }
    ])
    .run(['User', '$rootScope', function(User, $rootScope) {
        $rootScope.user = {};
        if(context['user']){
            context['user'] = new User(context['user']);
        }
        $rootScope.user = context['user'];
        $rootScope.context = context;
    }]);*/
angular.module('simpleadminApp', ['simpleadmin.filters','simpleadmin.directives','simpleadmin.models','simpleadmin.controllers','ui','ngRoute','ngSanitize'])
    .config([
      '$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.patch["Content-Type"] =  'application/json;charset=utf-8';
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
          var key, result = [];
          for (key in data) {
            if (data.hasOwnProperty(key)) {
              result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
          }
          return result.join("&");
        });
      }
    ])
    .config([
        '$interpolateProvider', function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            return $interpolateProvider.endSymbol(']]');
        }
    ])
    .config([
        '$routeProvider', function($routeProvider) {

        }
    ])
    .run(['User', '$rootScope', function(User, $rootScope) {
        $rootScope.user = {};
        window.context = [];
        window.context['user'] = new User();
        $rootScope.context = context;
    }]);