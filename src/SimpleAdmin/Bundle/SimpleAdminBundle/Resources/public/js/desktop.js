var clockInterval=null;
	
function initializeDesktop(){
    clearInterval(clockInterval);
    setDesktopClock();
    $(".desktop").css("width",($(window).width()-(document.all ?0:0))+"px");
    $(".desktop").css("height",($(window).height()-(document.all?0:0))+"px");
    $(".desktop,body").css("overflow","hidden");
    clockInterval = setInterval("setDesktopClock()",1000);
    $(".desktop").bind("click",function(event){
        var btnTop = $(".button.start").offset().top;
        var btnLeft = $(".button.start").offset().left;
        var btnH = $(".button.start").outerHeight();
        var btnW = $(".button.start").outerWidth();
        if( (event.pageY>=btnTop && event.pageY<=(btnTop+btnH)) && (event.pageX>=btnLeft && event.pageX<=(btnLeft+btnW))){
            if($('#sidebarmenu:first').queue("fx").length==0){
                $('#sidebarmenu:first').each(function(){
                    if($(this).css("display")=='block'){
                        $(this).find("ul").hide();
                        $(this).fadeOut("slow");
                    }
                    else{
                        $(this).fadeIn("slow");
                    }
                });
            }
        }
        else{
            $('#sidebarmenu:first').each(function(){
            $(this).find("ul").hide();
            $(this).fadeOut("slow");
            });
        }
    });
}
	
function addWaitMessage(){
    var callback = function(msg){
            var div  = '<div class="wait_message"><div class="msg">'+msg+'.</div></div">';
            $('body').append(div);
            $(".wait_message").centerInClient();
    };
    getTranslateEntry("please_wait",callback);
}

function removeWaitMessage(){
    $(".wait_message:first").remove();
}
	
function setDesktopClock(){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    $("#clock").html(h+":"+(m<10?("0"+m):m)+" "+(h<12?"a.m.":"p.m."));
}
	
function getMenuItemTable(id_menu_item){
    var table="";
    $.ajax({
        async: false,
        type: "POST",
        url: "ajax/_ajax-desktop.php",
        data:"opc=menuItemTable&id="+id_menu_item,
        success: function(data){
            table = data;
        }
    });
    return table;
}
	
function getMenuItemUrl(id_menu_item){
    var url="";
    $.ajax({
        async: false,
        type: "POST",
        url: "ajax/_ajax-desktop.php",
        data:"opc=menuItemUrl&id="+id_menu_item,
        success: function(data){
            url = data;
        }
    });
    return url;
}
	
function resizeWindowContent(window_id,w,h){

    w = w==undefined || w==''?$("#"+window_id).outerWidth():w;
    h = h==undefined || h==''?$("#"+window_id).outerHeight():h;

    var titleHeight = 0;
    $("#"+window_id).find(".pop-window-title").each(function(){
            var btw = isNaN(parseInt($(this).css("borderTopWidth")))?1:parseInt($(this).css("borderTopWidth"));
            var bbw = isNaN(parseInt($(this).css("borderBottomWidth")))?1:parseInt($(this).css("borderBottomWidth"));
            titleHeight = $(this).outerHeight()+btw+bbw+parseInt($(this).css("marginTop"))+parseInt($(this).css("marginBottom"));

    });
    var border_left   = isNaN(parseInt($("#"+window_id).find(".pop-window-content").css("borderLeftWidth")))?1:parseInt($("#"+window_id).find(".pop-window-content").css("borderLeftWidth"));
    var border_right  = isNaN(parseInt($("#"+window_id).find(".pop-window-content").css("borderRightWidth")))?1:parseInt($("#"+window_id).find(".pop-window-content").css("borderRightWidth"));
    var border_top    = isNaN(parseInt($("#"+window_id).find(".pop-window-content").css("borderTopWidth")))?1:parseInt($("#"+window_id).find(".pop-window-content").css("borderTopWidth"));
    var border_bottom = isNaN(parseInt($("#"+window_id).find(".pop-window-content").css("borderBottomWidth")))?1:parseInt($("#"+window_id).find(".pop-window-content").css("borderBottomWidth"));
    var padl = parseInt($("#"+window_id).find(".pop-window-content").css("paddingLeft")) + border_left;
    var padr = parseInt($("#"+window_id).find(".pop-window-content").css("paddingRight")) + border_right;
    var padt = parseInt($("#"+window_id).find(".pop-window-content").css("paddingTop")) + border_top;
    var padb = parseInt($("#"+window_id).find(".pop-window-content").css("paddingBottom")) + border_bottom;

    $("#"+window_id).css("width",w+"px");
    $("#"+window_id).css("height",h+"px");
    $("#"+window_id).find(".pop-window-content").each(function(){
        $(this).css("height",(h-titleHeight-padt-padb-parseInt($(this).css("marginTop"))-parseInt($(this).css("marginBottom"))-10)+"px");
    });

    $("#"+window_id).find(".pop-window-content-inner").each(function(){
        $(this).css("height",$(this).parent().height()+"px");
    });

    $("#"+window_id).find(".pop-window-content").each(function(){
        $(this).css("width",(w-padl-padr-parseInt($(this).css("marginLeft"))-parseInt($(this).css("marginRight")))+"px");
    });

    //Check if vertical scrollbar is present...
    if($("#"+window_id).find(".pop-window-content-inner").height() < $("#"+window_id).find(".pop-window-content-inner-box").height()){
        $("#"+window_id).find(".pop-window-content-inner-box").css("width",($("#"+window_id).find(".pop-window-content-inner").width()-20)+"px");
        //$("#"+window_id).css("width",(w+20)+"px");
    }
    else{
       $("#"+window_id).find(".pop-window-content-inner-box").css("width","100%");
    }


    if($("#"+window_id).find(".pop-window-content-inner").height() > $("#"+window_id).find(".pop-window-content-inner-box").height()){
        //$("#"+window_id).css("height",($("#"+window_id).find(".pop-window-content-inner-box").height()+titleHeight+40)+"px");
    }
    resizeHtmlEditorWidth(window_id);
}
	
function focusWindow(id){
    $(".pop-window").css("zIndex","1000");
    $("#"+id).css("zIndex","1001");
}
	

	
function reloadEditor(editor_id,section_id){
    $("#"+editor_id).parent().addAjaxLoader();
    $.ajax({
        async: true,
        type: "POST",
        url: "ajax/_ajax-edit-record.php",
        data:"opc=getHtmlEditorConf&section_id="+section_id+"&editor_id="+editor_id,
        success: function(data){
            var conf = eval(data);
            $("#"+editor_id).parent().find(".mceEditor").remove();
            $("#"+editor_id).css("display","block");
            tinyMCE.init({
                mode : "exact",
                elements:editor_id,
                theme : "advanced",
                language : LNG,
                plugins:conf[0].plugins,
                file_browser_callback : "tinyBrowser",
                content_css : conf[0].stylesheet,
                theme_advanced_styles : conf[0].stylelist,
                theme_advanced_buttons1 :conf[0].toolbar1,
                theme_advanced_buttons2 :conf[0].toolbar2,
                theme_advanced_buttons3 :conf[0].toolbar3,
                theme_advanced_buttons4 :conf[0].toolbar4,
                theme_advanced_toolbar_location : "top",
                theme_advanced_toolbar_align : "left",
                theme_advanced_statusbar_location : "bottom",
                theme_advanced_resizing : true
            });
            $("#"+editor_id).parent().find(".mceEditor,.mceLayout").css("width","100%");
            $("#"+editor_id).parent().removeAjaxLoader();
        }
    });
}
	
function reloadAllEditors(content_id,section_id){
    $("#"+content_id).find("textarea[id*='_htmlarea_']").each(function(){
        var editor_id = $(this).attr("id");
        reloadEditor(editor_id,section_id);
    });
}

function resizeHtmlEditorWidth(content_id){
    $("#"+content_id+" .mceLayout").each(function(){
        $(this).css("width","100%");
    });
}

function toggleWindowContent(win){
    var content = win.find(".pop-window-content-inner-box");

    if(content.css('display') == 'none'){
        content.css('display','block');
        win.fadeTo("fast",1);
    }
    else{
        content.css('display','none');
        win.fadeTo("fast",0.3);
    }
}
	
function resizeTaskbarItems(){
    var minw = 160;
    var barw = $('#task_bar').width();
    var items = $('.taskbar_item').length;
    var itemw = barw/items;
    itemw = itemw>160?160:itemw;
    $('.taskbar_item').each(function(){
            $(this).css("width",itemw+"px");
    });
}
	
function addTaskbarItem(window_id){
    var item_id = (window_id+'_taskbar_item').substr(1);
    var item = document.createElement("DIV");
    var title = $(window_id+" .title_box").html();
    //$(item).attr("id",item_id);
    $(item).html('<div class="button_text float_left"><span><nobr>'+title+'</nobr></span></div>');
    $('#task_bar').append('<div id="'+item_id+'" class="float_left taskbar_button"><div class="float_left button_text_left"><img src="images/admin/taskbar_item_left.gif"></div>'+$(item).html()+'<div class="float_left button_text_right"><img src="images/admin/taskbar_item_right.gif"></div></div>');
    //$('#'+item_id).addClass("button");
    //$('#'+item_id).addClass("taskbar_item");

    $('#'+item_id).bind("click",function(){
        setActiveTaskbarItem(window_id);
        focusWindow(window_id.substring(1));
    });
    $('#'+item_id).bind("focus",function(){
        $(this).trigger("blur");
    });
    setActiveTaskbarItem(window_id);
    resizeTaskbarItems();
}
	
function removeTaskbarItem(window_id){
        var item_id = (window_id+'_taskbar_item');
        $(item_id).remove();
        resizeTaskbarItems();
}
	
function setActiveTaskbarItem(window_id){
        $(".taskbar_item").each(function(){
                $(this).removeClass("active");
        });
        var item_id = (window_id+'_taskbar_item');
        $(item_id).addClass("active");
}
	
function createSectionWindow(section_id,id,parent_value){

    var window_id = id!=undefined?"#popup_"+section_id+"_"+id:"#popup_"+section_id;
    var url  = id!=undefined?"ajax/_ajax-edit-record.php":"ajax/_ajax-list.php";
    var data = id!=undefined?"opc=editRecord&section_id="+section_id+"&id="+id+(parent_value!=undefined?"&parent_value="+parent_value:""):"opc=sectionItemList&section_id="+section_id+"&"+(parent_value!=undefined?"&parent_value="+parent_value:"");

    if($(window_id).length==0){

        if(id==undefined || id == false){
            addWaitMessage();
        }
        $.ajax({
            async: true,
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                var callback = function(section_id,template,data,id,parent_value){
                    var margin = 9000;
                    $(".desktop").append(template);
                    $(window_id).css("marginLeft","-"+margin+"px");
                    $(window_id+" .pop-window-content-inner-box").html(data);

                    $(window_id).draggable({
                        containment: '.desktop',
                        scroll: false,
                        handle:'.pop-window-title',
                        start:function(event,ui){
                            $(this).data("scroll",($(this).find(".pop-window-content-inner").scrollTop()));
                            toggleWindowContent($(window_id));
                        },
                        stop:function(){
                            toggleWindowContent($(window_id));
                            $(this).find(".pop-window-content-inner").scrollTo($(this).data("scroll"));
                        }

                    });

                    $(window_id).resizable({
                        animate:false,
                        ghost:false,
                        start:function(event,ui){
                                toggleWindowContent($(window_id));
                        },
                        stop:function(event,ui){
                                toggleWindowContent($(window_id));
                                resizeWindowContent($(this).attr("id"),ui.size.width,ui.size.height);
                        },
                        resize:function(event,ui){
                                //resizeWindowContent($(this).attr("id"),ui.size.width,ui.size.height);
                        }
                    });

                    resizeWindowContent(window_id.substring(1));
                    focusWindow(window_id.substring(1));

                    $(window_id).bind('mousedown', function(event, ui) {
                        focusWindow(window_id.substring(1));
                        setActiveTaskbarItem(window_id);

                    });
                    $(window_id+" .close").click(function(){
                        $(window_id).fadeOut("fast",function(){
                            $(this).remove();
                            removeTaskbarItem(window_id);
                        });
                    });


                    $(window_id+" .maximize").click(function(){
                            if($(this).hasClass("restore")){
                                $(this).removeClass("restore");
                                $(window_id).css("width",$(window_id).data("w")+"px");
                                $(window_id).css("height",$(window_id).data("h")+"px");
                                $(window_id).css("top",$(window_id).data("top")+"px");
                                $(window_id).css("left",$(window_id).data("left")+"px");
                                resizeWindowContent($(window_id).attr("id"),$(window_id).data("w"),$(window_id).data("h"));
                            }
                            else{
                                $(this).addClass("restore");
                                $(window_id).data("w",   $(window_id).outerWidth());
                                $(window_id).data("h",   $(window_id).outerHeight());
                                $(window_id).data("top", $(window_id).offset().top);
                                $(window_id).data("left",$(window_id).offset().left);
                                $(window_id).css("width","100%");
                                $(window_id).css("height",$(".desktop").height() - $(".desktop_bootom_bar").outerHeight());
                                $(window_id).css("top","0px");
                                $(window_id).css("left","0px");
                                resizeWindowContent($(window_id).attr("id"),$(window_id).width(),$(window_id).height());
                            }
                    });

                    $(window_id).css("position","absolute");
                    $(window_id).css("top","30px");

                    if(id!=undefined){
                        $(window_id).centerInClient();
                    }
                    $(window_id).fadeOut("fast",function(){
                        $(this).css("marginLeft","0px");
                        $(window_id).fadeIn("fast",function(){
                            reloadAllEditors($(window_id).attr("id"),section_id);
                        });
                        resizeWindowContent($(window_id).attr("id"),$(window_id).width(),$(window_id).height());
                        $("#popup_"+section_id).removeAjaxLoader();
                    });
                    addTaskbarItem(window_id);
                    removeWaitMessage();
                };
                getPopupTemplate(section_id,data,callback,id,parent_value);
            }
        });
    }
    else{
        $("#popup_"+section_id).removeAjaxLoader();
        focusWindow(window_id.replace("#",""));
    }
}
	
//Get popup-window html structure
function getPopupTemplate(section_id,section_data,callback,id,parent_value){ 

    $.ajax({
        async: true,
        type: "POST",
        url: "ajax/_ajax-desktop.php",
        data:"opc=popupTemplate&section_id="+section_id+(id!=undefined?"&id="+id:"")+"&parent_value="+parent_value,
        success: function(template){
            callback.apply(this,[section_id,template,section_data,id,parent_value]);
        }
    });

}
	
	
//View children items
function showChildrenItems(section_id,parent_field,parent_value,page,page_size,order){
    page = page==undefined?1:page;
    page_size = page_size=undefined?false:page_size;
    parent_value = parent_value==undefined||parent_value==''?0:parent_value;
    order = order==undefined?false:order;
    filters = $("#popup_"+section_id+" #frm_filters").serializeForm();
    $("#popup_"+section_id+" .pop-window-content-inner-box").addAjaxLoader(true);
    $.ajax({
        async: true,
        type: "POST",
        url: "ajax/_ajax-list.php",
        data:"opc=sectionItemList&section_id="+section_id+"&"+parent_field+"="+parent_value+"&page="+page+(page_size?"&page_size="+page_size:"")+(order?"&order="+order:"")+(filters!=''?"&"+filters:""),
        success: function(data){
            $("#popup_"+section_id+" .pop-window-content-inner-box").html(data);
            $("#popup_"+section_id+" .pop-window-content-inner-box").removeAjaxLoader();
        }
    });
}
	
	
	
function editRecord( section_id,id,parent_value ) {
    $("#popup_"+section_id).addAjaxLoader();
    createSectionWindow(section_id,id,parent_value);
}

function newRecord(section_id,parent_value) {
    createSectionWindow(section_id,0,parent_value);
}

function updateTextareasHtmleditors(parent){
    //Update tab tiny-mce html-textareas  editor contents
    parent.find(".mceIframeContainer iframe").each(function(){
        var html = $(this).contents().find("body")[0].innerHTML;
        var idTextarea = $(this).attr("id").substr(0,$(this).attr("id").lastIndexOf("_"));
        $("#"+idTextarea).val(html);
    });
}
	
	
	
function saveRecord(el,section_id){

    el.parents(".pop-window").addAjaxLoader();
    var page = parseInt($("#popup_"+section_id+" #current_page").val());
    var parent_field = $("#popup_"+section_id+" #parent_field").val();
    var parent_value = $("#popup_"+section_id+" #parent_value").val();

    var page_size = parseInt($("#popup_"+section_id+" #current_page_size").val());
    var order = parseInt($("#popup_"+section_id+" #current_order").val());
    multipleComboboxSelectAll();

    //Update tiny-mce html-textareas  editor contents of active tab
    el.parents(".pop-window").find(".ui-tabs").find(".tab_content").each(function(){
        if(!$(this).hasClass("ui-tabs-hide")){
                updateTextareasHtmleditors($(this));
        }
    });

    var vars = el.serializeForm();
    
    $.ajax({
        async: true,
        type: "POST",
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        url: "ajax/_ajax-save.php",
        data:"opc=save&section_id="+section_id+(vars!=''?"&"+vars:""),
        success: function(){
            focusWindow('popup_'+section_id);
            showChildrenItems(section_id,parent_field,parent_value,page,page_size,order);
            el.parents(".pop-window").fadeOut("fast",function(){
                $(this).remove();
            });
            removeTaskbarItem("#"+el.parents(".pop-window").attr("id"));
        }
    });

}
	
function loadSection(section,layer_id){
    $('#'+layer_id).html('<div class="center_in_client"><img src="../images/admin/ajax-loader.gif"></div><script type="text/javascript">$(".center_in_client").centerInClient();</script>');
    $.ajax({
       async: true,
       type: "POST",
       url: "ajax/_ajax-desktop.php",
       data:"opc="+section,
       success: function(data){
                    $('#'+layer_id).html(data);
       }
    });
}
	
	
function userLogin(){
    var username = $("#username").val();
    var password = $("#password").val();

    if(checkFormFields('frmLogin',true,false,'#7E7E7E','#FFFFFF')){
        $.ajax({
           async: true,
           type: "POST",
           url: "ajax/_ajax.php",
           data:"opc=login&username="+username+"&password="+password,
           success: function(data){

                if(data=="1"){
                    $("#btnLogin").effect("pulsate",{times:1},1000,function(){
                        loadSection("desktop","content");
                    });
                }
                else{
                    showAlertMessage(txt_login_failed,"error",true);
                }
           }
        });
    }
}
	
function logout(){
    $("#btn_logout").addAjaxLoader(true);
        $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=getLogoutHtml",
        success: function(data){
            MySimpleLightBox.loadHTML(data);
            $("#btn_logout").removeAjaxLoader();
        }
    });
}
	
function processLogout(){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=logout",
        success: function(data){
                    window.location.reload();
        }
    });
}