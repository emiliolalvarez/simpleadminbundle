angular.module('simpleadmin.controllers',[])
    .controller('DesktopController', ['$scope','$compile','$routeParams','$q','$http','ManagedEntity','ListingWindow', function($scope,$compile,$rootParams,$q,$http,ManagedEntity,ListingWindow) {

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
            var id = "window_list_"+entry.entity.toLowerCase().replace(/[:|\|\/]/g,"_");
            if($("#"+id).length == 0){
                ListingWindow.listing({'repository':entry.entity,'page':1},function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http(
                        {
                            method: 'GET',
                            url: Routing.generate('simpleadmin_simpleadmin_simpleadmin_windowtemplate'),
                            daa: '',
                            headers: {
                                "Accept": "text/html"
                            }
                        }
                    ).success(function(data, status, headers, config) {
                            deferred.resolve(data);
                        }
                    );
                    deferred.promise.then(function(data){
                        var win = $(data);
                        win.attr('id',id);
                        win.draggable({ containment: ".desktop", scroll: false });
                        win.resizable();
                        $('.desktop').append(win);
                        $compile(win.contents())($scope);
                    })
                });
            }
        };

        $scope.closeWindow = function (el){
            $(el.target).parents('.pop-window').remove();
        }

        $scope.maximizeWindow = function(el){
            var w = $('.desktop').width()+'px';
            var h = ($('.desktop').height() - $('.desktop_bottom_bar').height()) +'px';
            var win = $(el.target).parents('.pop-window');
            win.data('restoreWidth',win.width()+'px');
            win.data('restoreHeight',win.height()+'px');
            win.css('width',w);
            win.css('height',h);
            win.find('.resotre').show();
            win.find('.maximize').hide();
        }

        $scope.restoreWindow = function(el){
            var win = $(el.target).parents('.pop-window');
            win.css('width',win.data('restoreWidth'));
            win.css('height',win.data('restoreHeight'));
            win.find('.resotre').hide();
            win.find('.maximize').show();
        }
    }]);