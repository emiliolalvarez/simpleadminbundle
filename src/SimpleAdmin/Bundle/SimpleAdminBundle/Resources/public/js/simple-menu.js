jQuery.fn.simpleMenu = function(menuOptions) {
  
  var self = this;	 
  // setup options
  
  var defaultOptions = {
	  type: "vertical",
	  hideMenu: function(){
	  	self.find("ul").hide();
		self.hide();
	  }
  };
  
  var options = $.extend({}, defaultOptions, menuOptions);

  this.initialize=function(){
	  $(this).each(function(){
		  
		  $(this).find("li").each(function(){
			  if($(this).children("ul:first").length>0){
				  $(this).children("a").css("cursor","default").append('<span style="float:right">&nbsp;&raquo;</span>');
			  }
			  $(this).bind("mouseover",function(){
				  
				  var current = $(this);
				  if(current.queue("fx").length==0){
					  $(this).parent("ul").children("li").each(function(){
						  if($(this)[0]!=current[0]){
							  $(this).find("ul").hide();
						  }
						  else{
							  $(this).find("ul:first").css("marginLeft",$(this).outerWidth()+"px");
							  $(this).find("ul:first").show();
							  var ul = $(this).find("ul:first");
                              if(ul.length){
                                  if((ul.offset().top+ul.outerHeight()) > (self.offset().top+self.outerHeight())){
                                      ul.css("marginTop",-(ul.outerHeight()-current.outerHeight())+"px");
                                  }
                              }
						  }
					  });
				  }
			  });
		  });

                  
                  
	  });
		 
  };
 
  return this.initialize();
};