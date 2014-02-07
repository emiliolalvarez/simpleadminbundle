angular.module('simpleadmin.directives', [])
    .directive('rgTooltip', function() {
        return {
            link: function(scope, element, attrs) {
                return element.tooltip();
            }
        };
    })
    .directive('rgTinymce', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.attr('id', element.attr('id').replace('[[$index]]', scope.$index));
                return tinyMCE.init({
                    selector: "#" + element.attr('id'),
                    theme: "advanced",
                    plugins: "pagebreak",
                    theme_advanced_buttons1: "mylistbox,mysplitbutton,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright,justifyfull,bullist,numlist,undo,redo,link,unlink,code",
                    theme_advanced_buttons2: "",
                    theme_advanced_buttons3: "",
                    theme_advanced_toolbar_location: "top",
                    theme_advanced_toolbar_align: "left",
                    theme_advanced_statusbar_location: "bottom",
                    theme_advanced_resizing: false,
                    theme_advanced_path: false,
                    content_css: "http://" + context["img_host"] + "/bundles/rgredguru/css/tinymce_custom_content.css",
                    init_instance_callback: "tinymceInitHandler",
                    handle_event_callback: "tinymceEventHandler"
                });
            }
        };
    })
    .directive('rgKeydown', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                return element.bind("keydown", function(evt) {
                    scope.$event = evt;
                    return scope.$apply(attrs.rgKeydown);
                });
            }
        };
    }).directive("rgBlur", function() {
        var postLink;
        return {
            restrict: "A",
            link: postLink = function(scope, element, attrs) {
                return element.bind("blur", function(evt) {
                    scope.$event = evt;
                    return scope.$apply(attrs.rgBlur);
                });
            }
        };
    }).directive("ngSelectLoad", function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                $(element).attr('disabled',true).css('opacity',.6);
                $.ajax({
                    url: Routing.getBaseUrl()+'/api/combo/values',
                    data: {
                        entity: scope.$eval($(element).attr('data-entity')),
                        order: scope.$eval($(element).attr('data-order')),
                        description: scope.$eval($(element).attr('data-description')),
                        pk: scope.$eval($(element).attr('data-pk'))
                    },
                    traditional: true
                }).done(function( data ) {
                    $.each(data.results, function( index, obj ) {
                        $(element).append('<option value="'+obj[data.meta.pk]+'">'+obj[data.meta.description]+'</option>');
                    });
                    $(element).attr('disabled',false).css('opacity',1);
                });
            }
        };
    });