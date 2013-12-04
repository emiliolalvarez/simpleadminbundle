angular.module('simpleadmin.filters', [])
    .filter('generateUrl', function() {
        return function(url, params) {
            return Routing.generate(url, params);
        };
    })
    .filter('contains', [
        '$filter', function($filter) {
            return function(array, value) {
                var result;
                result = $filter('filter')(array, value);
                return result.length > 0;
            };
        }
    ])
    .filter('joinChars', function() {
        return function(input) {
            if (input) {
                return input.toString();
            }
        };
    })
    .filter('capitalize', function() {
        return function(input, scope) {
            if (input) {
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        };
    });
