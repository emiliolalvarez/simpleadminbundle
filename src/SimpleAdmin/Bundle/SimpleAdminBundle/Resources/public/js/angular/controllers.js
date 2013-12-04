angular.module('simpleadmin.controllers',[])
    .controller('DesktopController', ['$scope','$compile','$routeParams','ManagedEntity','ListingWindow', function($scope,$compile,$rootParams,ManagedEntity,ListingWindow) {

        $scope.managedEntities = [];

        $scope.testVar = "test var 1";

        $scope.setTestVar = function(text) {
            $scope.testVar = text;
        };

        $scope.init = function(){
            console.log('DesktopController initialized!');
            $scope.getManagedEntities();
        };

        $scope.getManagedEntities=function(){
            ManagedEntity.managedentities({},function(entities){
                $scope.managedEntities = entities;
                $scope.renderMenu($('#sidebarmenu'),$scope.managedEntities);
                $("#sidebarmenu").simpleMenu();
            });
        };

        $scope.renderMenu = function(parent,entries){
            for(var i =0;i<entries.length; i++){
                var entry = entries[i];
                var li = $("<li></li>");
                parent.append(li);
                if(entry.children != undefined && entry.children.length){
                    var a = $("<a href='javascript:void(0)'>"+entry.name+"</a>");
                    li.append(a);
                    var ul = $("<ul></ul>");
                    li.append(ul);
                    $scope.renderMenu(ul,entry.children);
                }
                else{
                    var a = $("<a href='javascript:void(0)' ng-click='openListWindow("+JSON.stringify(entry)+")'>"+entry.name+"</a>");
                    li.append(a);
                }
            }

            $compile(parent.contents())($scope);
        };

        $scope.openListWindow = function(entry){
            ListingWindow.listing({'repository':entry.entity,'page':1});
            alert(entry.entity);
        };
    }]);