var fluigExtension = {
	
	serverUrl: "http://fluig.totvs.com",
	
	jProgress: null,
	jContentPost: null,
	jPublishButton: null,
	
	contentPost: "",
	
	init : function() {
		var self = this;
		
		self.jProgress = $('#progress');
		self.jContentPost = $('#fluig_content_post');
		self.jPublishButton = $('#fluig_publish_button');
		
		$(document).ajaxStart(function() {
			self.updateProgress(0, 50, 1000);
		});
		
		$(document).ajaxComplete(function(event,request, settings) {
			self.updateProgress(50, 105, 1000);
		});

		var jExtension = $('#fluig_extensin_content');
		var jLogin = $('#fluig_extension_login');
		
		if(self.isLogged() == true){
			jLogin.hide();
			jExtension.show();
			
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
			jLogin.show();
		}
	},
	
	postOk: function(){
		var self = this;
		self.jPublishButton.css('padding-left', '0.8571em');
		self.jPublishButton.css('background-image', 'none');

		$("#airplane").animate({
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
				if(data){
					logged = true;
				}
			},
			error: function(data){
				console.log("invalid session");
			}
		});
    	
    	return logged;
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
	fluigExtension.init();
});