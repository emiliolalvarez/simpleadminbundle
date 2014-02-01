angular.module('simpleadmin.controllers',[])
    .controller('DesktopController', ['$scope','$compile','$routeParams','$q','$http','ManagedEntity','ListingWindow', function($scope,$compile,$rootParams,$q,$http,ManagedEntity,ListingWindow) {

        $scope.managedEntities = [];

        $scope.listingWindows = [];

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
            $scope.showLoader($('.desktop'));
            if($("#"+id).length == 0){
                ListingWindow.listing({'repository':entry.entity,'page':1},function(data){
                    console.log(data);
                    var deferred = $q.defer();
                    $http(
                        {
                            method: 'GET',
                            url: Routing.generate('simpleadmin_simpleadmin_simpleadmin_listingwindowtemplate'),
                            params: {'windowId':id,'totalPages':data.totalPages,'currentPage':data.currentPage},
                            data: '',
                            headers: {
                                "Accept": "text/html"
                            }
                        }
                    ).success(function(template, status, headers, config) {
                            deferred.resolve(template);
                        }
                    );
                    deferred.promise.then(function(template){
                        $scope.renderList(template,id,entry,data);
                        $scope.removeLoader($('.desktop'));
                    })
                });
            }
        };

        $scope.adjustWindowContent = function(windowId){
            win = $('#'+windowId);
            var h= win.height() - win.find('.pop-window-title').height() - win.find('.pager').height();
            win.find('.pop-window-content').css('height',h+'px');
        };

        $scope.renderPage = function(win,data){
            var container = win.find('.pop-window-content-inner-box');
        };

        $scope.renderList = function(template,id,entry,data){
            var win = $(template);
            win.attr('id',id);
            win.draggable({ containment: ".desktop", scroll: false });
            win.resizable(
                {
                    stop:function(event){
                        $scope.adjustWindowContent($(event.target).attr('id'));
                    }
                }
            );
            $scope.listingWindows[win.attr('id')] = {'metadata': entry, 'data': data };
            $('.desktop').append(win);
            $compile(win.contents())($scope);
            $scope.adjustWindowContent(id);
            console.log(entry);
        };

        $scope.changeListingPage=function(page,windowId){
            console.log("Change to page: "+page);
            $scope.showLoader($('#'+windowId+' .pop-window-content'));

            var filters = '';
            if($('#'+windowId + ' .filters .filter').length){
                filters = $('#'+windowId + ' .filters .filter-form').serialize();
            }

            ListingWindow.listing({'repository':$scope.listingWindows[windowId].metadata.entity,'page':page, 'filters': filters},function(data){
                $scope.listingWindows[windowId].data = data;
                $scope.removeLoader($('#'+windowId+' .pop-window-content'));
            });
        };

        $scope.closeWindow = function (el){
            $(el.target).parents('.pop-window').remove();
        };

        $scope.maximizeWindow = function(el){
            var win = $(el.target).parents('.pop-window');
            var w = ($('.desktop').innerWidth() - parseInt(win.css('paddingLeft')) - parseInt(win.css('paddingRight')) )+'px';
            var h = ($('.desktop').innerHeight() - parseInt(win.css('paddingTop')) - parseInt(win.css('paddingBottom')) - $('.desktop_bottom_bar').height()) +'px';
            win.data('restoreWidth',win.width()+'px');
            win.data('restoreHeight',win.height()+'px');
            win.data('restoreTop',win.css('top'));
            win.data('restoreLeft',win.css('left'));
            win.css('width',w);
            win.css('height',h);
            win.css('top',0);
            win.css('left',0);
            win.find('.restore').show();
            win.find('.maximize').hide();
        }

        $scope.restoreWindow = function(el){
            var win = $(el.target).parents('.pop-window');
            win.css('width',win.data('restoreWidth'));
            win.css('height',win.data('restoreHeight'));
            win.css('top',win.data('restoreTop'));
            win.css('left',win.data('restoreLeft'));
            win.find('.restore').hide();
            win.find('.maximize').show();
        };

        $scope.showLoader = function(el){
            var w = el.width();
            var h = el.height();
            if(el.find(".ajax-loader").length==0){
                el.prepend('<div style="position: relative"><div class="ajax-loader" style="z-index:9999;position:absolute;left:0;margin:0px;padding:0px;width:'+w+'px;height:'+h+'px; background-color: #FFFFFF;filter: alpha(opacity=60);opacity:0.6"></div></div>');
            }
        };

        $scope.removeLoader = function(el){
            el.find('.ajax-loader').parent().remove();
        };

        $scope.range = function(n) {
            return new Array(n);
        };

    }]);