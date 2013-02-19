function onFormLoad(content_id,reg_id,js_code){
    eval(js_code);
}

function keepAlive(){
        $.ajax({
           async: true,
           type: "POST",
           url: DIR_ADMIN+"ajax/_ajax.php",
           data: "opc=getMicrotime",
           success: function(data){
           }
         });
}
	
function activatePasswordField(el){
        var name =  $(el).attr("id");
        var title = $(el).attr("title");
        $(el).replaceWith('<div class="password_box"><div class="float_left"><input title="'+title+'" class="input" type="text" class="input" value="" name="'+name+'">&nbsp;</div><div class="float_left pointer" style="padding-top:1px;" ><img src="'+DIR_IMG_ABSOLUTE_ADMIN+'icon-close.png" onclick="restorePasswordField($(this).parents(\'.password_box:first\'))"></div></div>');
}
	
function restorePasswordField(el){
    var id = $(el).find("input[type='text']:first").attr("name");
    var title = $(el).find("input[type='text']:first").attr("title");
    $(el).replaceWith('<span onclick="activatePasswordField($(this));" class="pointer" title="'+title+'"  id="'+id+'"><i>'+ getDictionaryEntry('click_to_change_password')+'</i></span>');
}

function toggleBackgroundIcon(el,image1,image2){

    if($(el).css("backgroundImage").indexOf(image1)!=-1){
        $(el).css("backgroundImage","url("+DIR_IMG_ABSOLUTE_ADMIN+image2+")");
    }
    else{
        $(el).css("backgroundImage","url("+DIR_IMG_ABSOLUTE_ADMIN+image1+")");
    }
}
	
	
	
function showFilterForm(table,filter_field,filter_field_description,multiple){
    multiple = multiple=='' || multiple==undefined?false:multiple;
    $.ajax({
       async: true,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax-filter-form.php",
       data: "opc=showFilterForm&table="+table+"&filter_field="+filter_field+"&filter_field_description="+filter_field_description+"&multiple="+multiple,
       success: function(data){
            MySimpleLightBox.loadHTML(data);
       }
    });
}
	
function filterFormSearch(table,filters,layer_content,page,filter_field,filter_field_description,multiple){
    $("#"+layer_content).addAjaxLoader();
    multiple = multiple=='' || multiple==undefined?false:multiple;
    filters = filters.split(",");
    var values = "";
    $(filters).each(function(idx,item){
            values += (values!=''?'&':'')+item+"="+$("#"+table+"_filter_"+item).val();
    });

    $.ajax({
       async: true,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax-filter-form.php",
       data: "opc=filterFormSearch&table="+table+"&"+values+"&page="+page+"&filter_field="+filter_field+"&filter_field_description="+filter_field_description+"&multiple="+multiple+"&filter_content_id="+layer_content,
       success: function(data){
            $("#"+layer_content).html(data);
       }
     });
}
	
function setFilterFormValue(filter_field,filter_field_description,value,description){
    $("#"+filter_field).val(value);
    $("#"+filter_field_description).val(description);
    $("#"+filter_field).trigger("change");
    MySimpleLightBox.close();
}

function addMultipleSelectorItem(id_list,description,post_name,id_item,wrap_tag,el){
    if(el!=false && el!=undefined && $(el).hasClass("disabled")){
            $(el).fadeTo("fast",1);
            $(el).removeClass("disabled");
            $("#"+id_list+" input[type='hidden'][value='"+id_item+"']").parents(wrap_tag+":first").remove();
            listItemBackground(id_list,"row","row2");
    }
    else{
            $("#"+id_list).append('<'+wrap_tag+' class="ui-state-active ui-corner-all"><table border="0" cellspacing="0" cellpadding="0"><tr><td class="desc">'+description+'<input type="hidden" name="'+post_name+'" value="'+id_item+'"></td><td class="drop"><img src="'+DIR_IMG_ABSOLUTE_ADMIN+'remove.gif" onclick="$(this).parents(\''+wrap_tag+':first\').remove();listItemBackground(\''+id_list+'\',\'row\',\'row2\');"/></td></tr></table></'+wrap_tag+'>');
            listItemBackground(id_list,"row","row2");
    }
}
	
function disableSearchResultsSelectedItems(multiple_list_id,form_results_id){

    $("#"+multiple_list_id+" input[type='hidden']").each(function(){

        if($("#"+form_results_id+"_item_"+$(this).val()).length>0){
                $("#"+form_results_id+"_item_"+$(this).val()).fadeTo("fast",0.3);
                $("#"+form_results_id+"_item_"+$(this).val()).addClass("disabled");
        }
    });
}
	
function listItemBackground(id_list,evenClass,oddClass){
    $("#"+id_list+" li:not(li:first)").each(function(idx){
            $(this).removeClass(evenClass).removeClass(oddClass);
            $(this).addClass(idx%2==0?oddClass:evenClass);
    });
}
	

function getDictionaryEntry(word){
    var translation="";
    $.ajax({
       async: false,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax.php",
       data: "opc=dictionary&word="+word,
       success: function(data){
        translation = data;
       }
     });
    return translation;
}
	
function checkAdminExists(){
    var returnValue = false;
    $.ajax({
       async: false,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax_submit.php",
       data: "opc=checkAdminExists&username="+document.getElementById('text_username').value+"&id="+document.getElementById('id').value,
       success: function(data){
        if(parseInt(data) == 1){
            var msg = getDictionaryEntry("user_exists");
                    alert(msg);
                    returnValue =  false;
            }
            else{
                    returnValue =  true;
            }
       }
     });
    return returnValue;
}
	
function checkTableUserEmailExists(){
    var returnValue = false;
    $.ajax({
       async: false,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax_submit.php",
       data: "opc=checkTableUserEmailExists&email="+document.getElementById('text_email').value+"&id="+document.getElementById('id').value,
       success: function(data){
        if(parseInt(data) == 1){
            var msg = getDictionaryEntry("email_exists");
                    alert(msg);
                    returnValue =  false;
            }
            else{
                    returnValue =  true;
            }
       }
     });

    return returnValue;
}
	
function checkTableUserUsernameExists(){
    var returnValue = false;
    $.ajax({
       async: false,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax_submit.php",
       data: "opc=checkTableUserUsernameExists&username="+document.getElementById('text_username').value+"&id="+document.getElementById('id').value,
       success: function(data){
        if(parseInt(data) == 1){
            var msg = getDictionaryEntry("username_exists");
                    alert(msg);
                    returnValue =  false;
            } 
            else{
                    returnValue =  true;
            }
       }
     });

    return returnValue;
}
	
function uploadFile(content_id,tipo,svar,idRegistro) {
    open_window( 'image', DIR_ADMIN+'upload_file.php?content_id='+content_id+'&svar='+svar+'&tipo='+tipo+'&idRegistro='+idRegistro, 'top='+(((window.availHeight-120)/2))+',left='+(((window.availWidth-500)/2))+', width=500, height=120, resizable=yes, scrollbars=yes, status=no' );
}

function uploadGaleria(content_id,tipo,svar,idRegistro) {
    open_window( 'image', DIR_ADMIN+'upload_image.php?content_id='+content_id+'&svar='+svar+'&tipo='+tipo+'&idRegistro='+idRegistro, 'top='+(((window.availHeight-120)/2))+',left='+(((window.availWidth-500)/2))+', width=500, height=120, resizable=yes, scrollbars=yes, status=no' );
}
	
	
function upload(content_id,content,file,svar,id,multiple,win,opc){

    if(multiple=='0'){
            $("#"+content).html("");
    }
    $.ajax({
       async: false,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax.php",
       data: "opc="+opc+"&form_serial="+content_id+"&content="+content+"&archivo="+file+"&svar="+svar+"&idRegistro="+id,
       success: function(data){
            if(data!=''){
                    $("#"+content).append(data);
                    win.close();
            }
       }
    });

}

function removeImage(content,svar,file,id,lng){
    var element = $("#"+id);
    var msg = getDictionaryEntry("drop_image");
    if(confirm(msg)){
        $.ajax({
           async: true,
           type: "POST",
           url: DIR_ADMIN+"ajax/_ajax.php",
           data: "opc=removeImage&content="+content+"&archivo="+file+"&svar="+svar+"&id="+id,
           success: function(data){
                        element.remove();

           }
         });
    }
}
	
function removeFile(content,svar,file,id,lng){
    var element = $("#"+id);
    var msg = getDictionaryEntry("drop_file");

    if(confirm(msg)){
        $.ajax({
           async: true,
           type: "POST",
           url: DIR_ADMIN+"ajax/_ajax.php",
           data: "opc=removeFile&content="+content+"&archivo="+file+"&svar="+svar+"&id="+id,
           success: function(data){
                        element.remove();
           }
         });
    }
}
	
function editImageContents(content,type){
    $.ajax({
       async: true,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax.php",
       data: "opc=editImageContents&type="+type+"&content="+content,
       success: function(data){
            MySimpleLightBox.loadHTML(data);
            $("#"+content+"_edition_box_tabs").tabs({});
            loadItemEditionContents(content);
       }
    });
}
	
function editFileContents(content,type){
    $.ajax({
       async: true,
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax.php",
       data: "opc=editFileContents&type="+type+"&content="+content,
       success: function(data){
            MySimpleLightBox.loadHTML(data);
            $("#"+content+"_edition_box_tabs").tabs({});
            loadItemEditionContents(content);
       }
    });
}
	
function loadItemEditionContents(content){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=getLanguagesCodes",
        success: function(data){
            codes = data.split(",");
            for(var i=0;i < codes.length; i++){
                $("#"+content+" input."+codes[i]+",#"+content+" textarea."+codes[i]).each(function(){
                        if($(this).hasClass("item_description")){
                                $("#"+content+"_edition_box .item_description."+codes[i]).val($(this).val());
                        }
                        else if($(this).hasClass("item_link")){
                                $("#"+content+"_edition_box .item_link."+codes[i]).val($(this).val());
                        }
                        else if($(this).hasClass("item_video")){
                                $("#"+content+"_edition_box .item_video."+codes[i]).val($(this).val());
                        }
                });
            }
        }
    });
}
	
function updateItemEditionContents(content){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=getLanguagesCodes",
        success: function(data){
            codes = data.split(",");
            for(var i=0;i < codes.length; i++){
                $("#"+content+" input."+codes[i]+",#"+content+" textarea."+codes[i]).each(function(){
                        if($(this).hasClass("item_description")){
                                $(this).val($("#"+content+"_edition_box .item_description."+codes[i]).val());
                        }
                        else if($(this).hasClass("item_link")){
                                $(this).val($("#"+content+"_edition_box .item_link."+codes[i]).val());
                        }
                        else if($(this).hasClass("item_video")){
                                $(this).val($("#"+content+"_edition_box .item_video."+codes[i]).val());
                        }
                });
            }
            MySimpleLightBox.close();
        }
    });
}

function updateList(lista,section_id,position_field,id_field,inicio){

    var listIds;

    $("#"+lista+"  li:not(li:first)").each(function(){
        $(this).removeClass("row").removeClass("row2").removeClass("rowOn");
    });
    $("#"+lista+"  li:not(li:first):even").each(function(){
                $(this).addClass("row");
    });
    $("#"+lista+" li:not(li:first):odd").each(function(){
                $(this).addClass("row2");
    });

    //Obtengo una lista de los id delimitados por ","
    listIds = ""+$('#'+lista).sortable('toArray');

    while(listIds.indexOf("listFila")!=-1){
        listIds = listIds.replace("listFila","");
    }

    inicio=inicio==undefined?"1":inicio;
    var idx=parseInt(inicio);
    idx=idx<1?1:idx;
    $("#"+lista+" .listRowNumber").each(function(){
        $(this).html(idx+'.-'+'&nbsp;&nbsp;');
        idx=idx+1;
    });

    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=orderList&ids="+listIds+"&section_id="+section_id+"&id_field="+id_field+"&position_field="+position_field+"&inicio="+inicio,
        success: function(data){}
    });
}
	
function open_window( name, page, params ) {
    var win = window.open( page, 'window' + name, params );
    win.focus();
}

function changeStatus(e,section_id,id ) {
    var el = $(eventTrigger(e));
    el.parents("li").addAjaxLoader(true);
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=changeStatus&id='+id+'&section_id='+section_id,
        success: function(data){
            if(parseInt(data)==1){
                el.parents('li').find('#status'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_on.gif');
            }
            else{
                el.parents('li').find('#status'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_off.gif');
            }
            el.parents('li').removeAjaxLoader();
            if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
            }
            else{
            }
        }
    });
}
	
function changeActiveButton(el,section_id,id ) {
    el.parents("li").addAjaxLoader(true);
    $.ajax({
       type: "POST",
       url: DIR_ADMIN+"ajax/_ajax.php",
       data: 'opc=changeActiveButton&id='+id+'&section_id='+section_id,
       success: function(data){
         if(parseInt(data)==1){
                    el.find('#activeButton'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_on.gif');
             }
             else{
                    el.find('#activeButton'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_off.gif');
             }
         el.parents('li').removeAjaxLoader();
       }
     });
}
	
function changeLock(e,el,section_id,id ) {
    el.parents("li").addAjaxLoader(true);
    $.ajax({
    type: "POST",
        url: "ajax/_ajax.php",
        data: 'opc=changeLock&id='+id+'&section_id='+id,
        success: function(data){
            if(parseInt(data)==1){
                el.find('#lock'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_lock_on.gif');
            }
            else{
                el.find('#lock'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_lock_off.gif');
            }
            el.parents('li').removeAjaxLoader();
            if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
            }
        }
    });
}

function changeHistoryStatus( e,el,section_id,id ) {
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=changeHistoryStatus&id='+id+'&section_id='+id,
        success: function(data){
             if(data=="1"){
                 el.find('#history'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_history_on.gif');
             }
             else{
                 el.find('#history'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_history_off.gif');
             }
             if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
             }
        }
    });
}

function changeHighlight(e,el,section_id, id ) {
    el.parents("li").addAjaxLoader(true);
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=highlightItem&id='+id+'&section_id='+section_id,
        success: function(data){
            if(data=="1"){
                el.find('#highlight'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_on.gif');
            }
            else{
                el.find('#highlight'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_off.gif');
            }
            el.parents("li").removeAjaxLoader();
            if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
            }
        }
    });
}
	
function changeHighlightRed(e,el,section_id, id ) {
el.parents("li").addAjaxLoader(true);
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=highlightRed&id='+id+'&section_id='+section_id,
        success: function(data){
            if(data=="1"){
                el.find('#highlightRed'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_red_on.gif');
            }
            else{
                el.find('#highlightRed'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_red_off.gif');
            }
            el.parents("li").removeAjaxLoader();
            if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
            }
        }
    });
}
	
function setPrincipal(e,el,section_id,id,filter_field,filter_value) {
    el.parents("li").addAjaxLoader(true);
    if(el.find('#principal'+id).attr('src').indexOf('icon_highlighted_red_on.gif')!=-1){
    el.find('#principal'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_red_off.gif');
    }
    else{
    el.find('#principal'+id).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_red_on.gif');
    }
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=setPrincipal&id='+id+'&section_id='+section_id+'&filter_field='+filter_field+'&filter_value='+filter_value,
        success: function(data){
            if(data!='' && data !='off'){
                el.parents("ul").find('#principal'+data).attr('src',DIR_IMG_ABSOLUTE_ADMIN+'icon_highlighted_red_off.gif');
            }
            el.parents("li").removeAjaxLoader();
            if(!isPointerInside(e, el)){
                el.parents('li').removeClass('rowOn');
            }
        }
    });
}

function confirmDrop( el,section_id,id,sortable,order_field,lng ){
    el.parents("li").addAjaxLoader(true);
    var list_id = el.parents("ul:first").attr("id");
    var msg="";
    msg = getDictionaryEntry("confirm_drop");
    if ( confirm( msg ) ) {
        $("#popup_"+section_id+"_"+id).remove();
        $("#popup_"+section_id+"_"+id+"_taskbar_item").remove();
        $.ajax({
            type: "POST",
            url: DIR_ADMIN+"ajax/_ajax.php",
            data: "opc=dropItem&section_id="+section_id+"&id="+id+"&sortable="+sortable+"&order_field="+order_field,
            success: function(data){
                el.parents("li").removeAjaxLoader();
                el.parents("li").remove();
                if(sortable=='1'){
                    updateList(list_id,section_id,order_field,"id");
                }
                else{
                    var page = parseInt($("#"+list_id+" #current_page").val());
                    var page_size = parseInt($("#"+list_id+" #current_page_size").val());
                    $("#"+list_id+" .listRowNumber").each(function(idx){
                        $(this).html(((page-1)*page_size)+(idx+1)+"&nbsp;&nbsp;");
                    });
                }
            }
        });
    }
    else{
        el.parents("li").removeAjaxLoader();
    }
}
	
function initDatepicker(field_id){
    $("#"+field_id).datepicker({showOn: 'both', buttonImage: DIR_IMG_ABSOLUTE_ADMIN+'date.jpg', buttonImageOnly: true});
    $("#"+field_id).datepicker('option','dateFormat', 'dd-mm-yy');
    $("#"+field_id).datepicker('option','defaultDate' ,'+0' );
}
	
function duplicateAjaxForm(button,callback,precall){

    callback = callback==undefined?false:callback;
    precall  = precall==undefined?false:precall;
    var el = button.parents('.ajax_form');
    var content_id = el.parents(".ajax_fieldset:first").attr("id");
    var clone = document.createElement("DIV");
    var attr_class = el.attr("class");
    var attr_style = el.attr("style");
    var serials = [];
    var html = '';

    var duplicateProcess = function(content_id,callback){
        $("#"+content_id).addAjaxLoader(true);

        //Rewrite "value" and checked attributes
        el.find("input").each(function(idx){
            var obj = document.createElement("DIV");
            $(this).clone().appendTo($(obj));
            var objhtml = $(obj).html();
            if(this.type=='radio' || this.type=='checkbox'){
                objhtml=objhtml.replace(/\s+(checked)=".*?"/g,' ');
                objhtml=objhtml.replace(/\s+(checked)/g,' ');
                if(this.checked){
                        objhtml=objhtml.replace(/<input /g,'<input checked="checked" ');
                }
            }
            objhtml=objhtml.replace(/\s+(value)=".*?"/g,' ');
            objhtml=objhtml.replace(/<input /g,'<input value="'+$(this).val()+'" ');

            $(this).replaceWith(objhtml);
        });

        //Rewrite "selected" attribute
        el.find("select").each(function(idx){
            $(this).find("option[value='"+$(this).val()+"']").each(function(){
                var obj = document.createElement("DIV");
                $(this).clone().appendTo($(obj));
                var objhtml = $(obj).html();
                objhtml=objhtml.replace(/\s+(value)=".*?"/g,' value="'+$(this).attr("value")+'" selected="selected" ');
                $(this).replaceWith(objhtml);
            });

        });

        $(clone).html(el.html());

        $(clone).find("input[name='form_serial[]']").each(function(){
                serials.push($(this).val());
        });

        $(clone).find(".ajax_fieldset").each(function(){
                serials.push($(this).attr("id"));
        });

        $(clone).find(".field-box.date-type").each(function(){
                $(this).find("img").remove();
                $(this).find("input").removeClass("hasDatepicker");
        });

        html = '<div id="'+el.attr("id")+'" class="'+attr_class+'" style="'+attr_style+'">'+$(clone).html()+'</div>';

        duplicateAjaxFormReplaceSerials(html,0,serials,content_id,null,callback);

    };
    try{
        //IF PRECALL FUNCTION IS DEFINED...
        eval(precall).apply(this,[button.attr("id"),content_id,duplicateProcess,callback]);
    }
    catch(ex){
        duplicateProcess.apply(this,[content_id,callback]);
    }
}
	
function duplicateAjaxFormReplaceSerials(html,idx,serials,content_id,parent_item_id,callback){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=getMicrotime",
        success: function(data){

            while(html.indexOf(serials[idx])!=-1){
                html = html.replace(serials[idx],data);
            }
            if(idx<serials.length-1){
                if(idx == 0){
                parent_item_id = data;
                }
                duplicateAjaxFormReplaceSerials(html,idx+1,serials,content_id,parent_item_id,callback);
            }
            else{
                var clone = document.createElement("DIV");
                $(clone).html(html);
                $(clone).find(".drop_ajax_form").each(function(){
                    var parentSerial = $(this).parents(".ajax_form").find("input[name='form_serial[]']").val();
                    var parentTable  = $(this).parents(".ajax_form").find("input[name='"+parentSerial+"_table']").val();
                    var parentFormSerial = $(this).parents(".ajax_form:first").parents(".ajax_form:first").find("input[type='hidden'][name='form_serial[]']").val();
                    $(this).parents(".ajax_form").find("input[name='"+parentSerial+"_id']").val(0);
                    $(this).parents(".ajax_form").find("input[name='"+parentSerial+"_parent_form_serial']").val(parentFormSerial);
                    $(this).replaceWith('<img src="'+$(this).attr("src")+'" class="'+$(this).attr("class")+'" onclick="deleteAjaxForm(\''+parentSerial+'\',0,\''+parentTable+'\');"/>');
                });
                $("#"+content_id).append($(clone).html());
                $("#"+content_id).find(".date-type input").each(function(){
                    if(!$(this).hasClass("hasDatepicker")){
                        initDatepicker($(this).attr("id"));
                    }
                });
                $("#"+parent_item_id).parents(".pop-window-content-inner").scrollTo($("#"+parent_item_id),1000,{onAfter:function(){$("#"+content_id).removeAjaxLoader();}});
                $("#"+content_id).removeAjaxLoader();
                if(callback){
                    try{
                        callback.apply(this,[content_id]);
                    }
                    catch(ex){
                    }
                }

            }
        }
    });
}
	
function duplicateRegistry(content_id,section_id,id,description_field){
    $("#popup_"+section_id).addAjaxLoader(true);
    MySimpleLightBox.close();
    $.ajax({
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: "opc=duplicateRegistry&section_id="+section_id+"&id="+id+"&description_field="+description_field,
        success: function(data){
            $("#popup_"+section_id).parents(".pop-window").removeAjaxLoader();
            if($("#"+content_id).find("#frm_filters").length > 0){
                $("#"+content_id).find("#frm_filters .button-accept").trigger("click");
            }
            else{
                var parent_value = $("#"+content_id).find("#parent_value").val();
                var page = $("#"+content_id).find("#current_page").val();
                var page_size = $("#"+content_id).find("#current_page_size").val();
                var order = $("#"+content_id).find("#current_order").val();
                showChildrenItems(section_id,parent_value,page,page_size,order);
            }
            $("#popup_"+section_id).removeAjaxLoader();
        }
    });
}
	
    function showDuplicateForm(content_id,section_id,id,description_field,description){
        var msgDuplicateRegistry = getDictionaryEntry("duplicate_registry");
        var msgCancel = getDictionaryEntry("no");
        var msgAccept = getDictionaryEntry("yes");

        var html = '<div class="logout_form float_left ui-corner-all">';
        html+='<div class="float_left logout_message">'+msgDuplicateRegistry+'?</div>';
        html+='<div class="float_right actions btns">';
        html+='<div class="float_right pointer"><span onclick="MySimpleLightBox.close();">'+msgCancel+'</span></div>';
        html+='<div class="float_right pointer"><span onclick="duplicateRegistry(\''+content_id+'\',\''+section_id+'\',\''+id+'\',\''+description_field+'\');">'+msgAccept+'</span></div>';
        html+='</div>';
        html+='</div>';
        MySimpleLightBox.loadHTML(html);
    }

	
		
    function getMicrotime(){
        var micro = "";
        $.ajax({
            type: "POST",
            url: DIR_ADMIN+"ajax/_ajax.php",
            data: "opc=getMicrotime",
            success: function(data){
                micro = data;
            }
        });
        return micro;
    }
	
    function addAjaxForm(parent_form_serial,section_id,foreing_pk_field,content,unique,width){
        $.ajax({
            type: "POST",
            url: DIR_ADMIN+"ajax/_ajax.php",
            data: 'opc=ajaxForm&parent_form_serial='+parent_form_serial+'&section_id='+section_id+'&foreing_pk_field='+foreing_pk_field+'&content='+content+'&unique='+unique+'&width='+width,
            async: false,
            success: function(data){
                var div = document.createElement("DIV");
                $("#"+content).append(data);
                $("#"+content+" .ajax_form:last").css("width",width);
                reloadAllEditors(content,section_id);
                resizeAjaxForms(content);
            }
        });
    }
	
    function resizeAjaxForms(container,id_section){
        setTimeout("timeoutResizeAjaxForms('"+container+"')",600);
        setAjaxFormsPosition(container);
    }
	
    function timeoutResizeAjaxForms(container){
        if($("#"+container).css("display")=='block'){
            var auxh=0;
            $("#"+container+" .ajax_form").each(function(){
                    auxh = $(this).height()>auxh?$(this).height():auxh;
            });
            /*
            if(document.all){ //IE
                    $("#"+container+" .ajax_form").css("height",auxh+"px");
            }
            else{//OTHER
                    $("#"+container+" .ajax_form").css("min-height",auxh+"px");
                    $("#"+container+" .ajax_form").css("height","auto!important");
            }
            */
        }
    }

    function deleteAjaxForm(idAjax,idRegistro,tabla){

        if(confirm(getDictionaryEntry("confirm_drop") )){
            $.ajax({
               type: "POST",
               url: DIR_ADMIN+"ajax/_ajax.php",
               data: 'opc=deleteAjaxForm&idRegistro='+idRegistro+'&tabla='+tabla,
               async: false,
               success: function(data){
                    $("#"+idAjax).remove();
               }
            });
        }	
    }

    function loadAjaxCombo(sourceCombo,targetCombo,table,idField,descField,orderField,value,target_selected_value,dir) {
        var combo = document.getElementById(targetCombo);
        combo.length=0;
        combo.options[combo.length]=new Option("Loading...",""); // AGREGO AL COMBO UN NUEVO ITEM
        var resp;
        $.ajax({
            type: "POST",
            url: DIR_ADMIN+"ajax/_ajax_on_change.php",
            data: "opc=loadComboIds&table="+table+"&idField="+idField+"&descField="+descField+'&orderField='+orderField+'&sourceField='+sourceCombo+'&value='+value,
            async: false,
            success: function(data){

                        resp = createXMLStringParser(data);
            }
        });

        combo.length=0;
        if(targetCombo.indexOf('filter_')!=-1){
            combo.options[combo.length]=new Option("-",""); // AGREGO AL COMBO UN NUEVO ITEM
        }
        for (i = 0; i < resp.getElementsByTagName('item').length; i++){ //RECORRO LOS TAGS "item" DEL XML
            var elemento = resp.getElementsByTagName('item')[i]; //OBTENGO EL TAG "item" actual
            var texto = elemento.getElementsByTagName('text')[0].firstChild.data; //OBTENGO EL VALOR DEL TAG "text" DENTRO DEL TAG "item" ACTUAL
            var id = elemento.getElementsByTagName('id')[0].firstChild.data; //OBTENGO EL VALOR DEL TAG "id" DENTRO DEL TAG "item" ACTUAL
            combo.options[combo.length]=new Option(texto,id); // AGREGO AL COMBO UN NUEVO ITEM
            if(id == target_selected_value){
                combo.options[i].selected=true;
            }
        }
    }



/************************************* PROPERTIES TABLE **********************************************/
    function changeProperties(form_serial,layer,table_source,table_properties,id_properties_table,id_reg,selected_property_table){
        $.ajax({
           type: "POST",
           url: DIR_ADMIN+"ajax/_ajax.php",
           data: 'opc=changeProperties&form_serial='+form_serial+'&layer='+layer+'&table_source='+table_source+'&table_properties='+table_properties+'&id_properties_table='+id_properties_table+'&id_reg='+id_reg+'&selected_property_table='+selected_property_table,
           success: function(data){
                        $("#"+layer).html(data);
                        $("#"+layer+" .properties_table_tabs").tabs({});
           }
        });	
    }

    function addPropertyField(list,form_serial,table,idColumn,value){
        $.ajax({
           type: "POST",
           url: DIR_ADMIN+"ajax/_ajax.php",
           async: false,
           data: 'opc=addPropertyField&form_serial='+form_serial+'&table='+table+'&idColumn='+idColumn+'&value='+value,
           success:function(data){
                        $('#'+list).append(data);
           }
        });
    }
	
    function removePropertyField(el,table,id){
        var msg = getDictionaryEntry("confirm_drop");
        if ( confirm( msg ) ) {
                $.ajax({
                   type: "POST",
                   url: DIR_ADMIN+"ajax/_ajax.php",
                   async: false,
                   data: 'opc=removePropertyField&table='+table+'&id='+id,
                   success:function(data){
                                el.parents("tr:first").remove();
                   }
                });
        }
    }
	
/*********************************** END OF PROPERTIES TABLE **********************************************/

	
function multipleComboboxSelectAll(){
    $("select[multiple]").each(function(){
        $(this).find("option").each(function(){
            $(this).attr("selected","selected");
        });
    });
}

function selectAllItems(combo){
    var lista=document.getElementById(combo);
    if(lista){
        for(var i=0;i<lista.length;i++){
            var opt=lista.options[i];
            opt.selected=true;
        }
    }
}

function trim(cadena){
    for(i=0; i<cadena.length; ){
        if(cadena.charAt(i)==" ")
            cadena=cadena.substring(i+1, cadena.length);
        else
            break;
    }

    for(i=cadena.length-1; i>=0; i=cadena.length-1){
        if(cadena.charAt(i)==" ")
            cadena=cadena.substring(0,i);
        else
            break;
    }

    return cadena;
}
	
/*******************************************************************************************/
	
	
/************************************AJAX CALENDAR******************************************/
		
function changeCalendar(id,m,y,idReg,table_source){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=changeCalendar&id='+id+'&mes='+m+'&ano='+y+'&idReg='+idReg+'&table_source='+table_source,
        success: function(data){
            $('#'+id).html(data);
        }
    });
}
function setCalendarDate(id,date,state){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=setCalendarDate&id='+id+'&date='+date+'&state='+state,
        success: function(data){

        }
    });
}

function unsetCalendarDate(id,date){
    $.ajax({
        async: true,
        type: "POST",
        url: DIR_ADMIN+"ajax/_ajax.php",
        data: 'opc=unsetCalendarDate&id='+id+'&date='+date,
        success: function(data){

        }
    });
}

function getCleanColor(color){
    while(color.indexOf(", ")!=-1){
        color = color.replace(", ",",");
    }
    if(color.indexOf(" ")!=-1){
        color=color.substring(0,color.indexOf(" "));
    }
    return color;
}

function setAjaxFormsPosition(idAjaxFormContainer){
    $("#"+idAjaxFormContainer).find("input[type='hidden'][name$='position']").each(function(idx){
        $(this).val(idx);
    });
    
}
    /*****************************END OF AJAX CALENDAR******************************************/