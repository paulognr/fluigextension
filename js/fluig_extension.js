var fluigExtension = {
	
	serverUrl: "http://fluig.totvs.com",

	jContentPost: null,	
	jProgress: null,
	jPublishButton: null,
	jStartLoad: null,
	
	contentPost: "",
	
	loadJQuery: function(){
		var self = this;
		
		setTimeout(function(){
			self.loadJsFile("../js/jquery-2.1.1.min.js", function(){
				self.loadJQueryObjects();
				self.loadJsFile("../js/jquery.urlshortener.min.js", function(){
					self.init();
				});
			});
		}, 1000);
		
		return;
	},
	
	init : function() {
		var self = this;
		
		var jExtension = $('#fluig_extensin_content');
		var jLogin = $('#fluig_extension_login');
		
		if(self.isLogged() == true){
			jLogin.hide();
			self.jStartLoad.fadeOut(function(){
				$('html').css('background-color','#EBEBEB');
				jExtension.show();
			})
			
			var currentUrl = null;
			var currentTitle = null;
			
			jQuery.urlShortener.settings.apiKey='AIzaSyD50283xRGCwMj3Qmk_qu19v5FyteAGZ-Q';
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				currentUrl = tabs[0].url;
				currentTitle = tabs[0].title;

				jQuery.urlShortener({
					longUrl: currentUrl,
					success: function (shortUrl) {
						self.contentPost = currentTitle + " " + shortUrl;
						self.jContentPost.val(self.contentPost);
					},
					error: function(data){
						console.log('invalid url');
					}
				});
			});
			
			self.jPublishButton.click(function(){
				self.contentPost = self.jContentPost.val();
				self.jContentPost.attr('disabled','true');
				
		    	$.ajax({
					type: "POST",
					async: true,
					url: self.serverUrl + "/api/public/social/post/create",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({text: self.contentPost}),
					success: function(data){
						self.postOk();
					},
					error: function(data){
						if(data.status == 200){
							self.postOk();
						}
					}
				});
			});
		}else{
			$('html').css('background-color','#FFF');
			$('#login_fluig').attr('href', self.serverUrl + '/portal');
			jExtension.hide();
			self.jStartLoad.fadeOut(function(){
				jLogin.show();
			});
		}
	},
	
	postOk: function(){
		var jAirplane = $('#airplane');
		jAirplane.show();
		
		var self = this;
		self.jPublishButton.css('padding-left', '0.8571em');
		self.jPublishButton.css('background-image', 'none');

		jAirplane.animate({
			top : "-=250",
			left : "+=100"
		}, 1500, function() {
			window.close();
		});
	},
	
	isLogged: function(){
		var self = this;
		var logged = false;
		
		$.ajax({
			type: "GET",
			async: false,
			url: self.serverUrl + "/api/public/social/user/current",
			contentType: "application/json",
			success: function(data){
				if(!data){
					logged = true;
				}
			},
			error: function(data){
				console.log("invalid session");
			}
		});
    	
    	return logged;
	},
	
	loadJsFile: function(filename, callback){
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
		fileref.onload = callback;
		document.getElementsByTagName("head")[0].appendChild(fileref);
	},
	
	loadJQueryObjects: function(){
		var self = this;
		
		self.jStartLoad = $('#fluig_extension_start_load');
		self.jProgress = $('#progress');
		self.jContentPost = $('#fluig_content_post');
		self.jPublishButton = $('#fluig_publish_button');
	},
	
	updateProgress: function(startProgress, endProgress, durantion) {
		var self = this;
		$({property: startProgress}).animate({property: endProgress}, {
		    duration: durantion,
		    step: function() {
		        var percent = Math.round(this.property);
		        self.jProgress.css('width', percent + "%");
		        if(percent == 105) {
		        	self.jProgress.addClass("done");
		        }
		    },
		});
	}
};

document.addEventListener('DOMContentLoaded', function() {
	fluigExtension.loadJQuery();
});