var fluigExtension = {
	
	serverUrl: "http://10.80.81.96:8080",
	
	jProgress: null,
	jContentPost: null,
	jPublishButton: null,
	
	contentPost: "",
	
	init : function() {
		var self = this;
		self.jProgress = $('#progress');
		self.jContentPost = $('#fluig_content_post');
		self.jPublishButton = $('#fluig_publish_button');
		
		jQuery.urlShortener.settings.apiKey='AIzaSyD50283xRGCwMj3Qmk_qu19v5FyteAGZ-Q';
		
		$(document).ajaxStart(function() {
			self.updateProgress(0, 50, 1000);
		});
		
		$(document).ajaxComplete(function(event,request, settings) {
			self.updateProgress(50, 105, 1000);
		});
		
		var jLogin = $('#fluig_extension_login');
		var jExtension = $('#fluig_extensin_content');
		if(self.isLogged() == true){
			jLogin.hide();
			jExtension.show();
		}else{
			$('html').css('background-color','#FFF');
			$('#login_fluig').attr('href', self.serverUrl + '/portal');
			jExtension.hide();
			jLogin.show();
		}
		
		var currentUrl = null;
		var currentTitle = null;
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			currentUrl = tabs[0].url;
			currentTitle = tabs[0].title;

			jQuery.urlShortener({
				longUrl: currentUrl,
				success: function (shortUrl) {
					self.contentPost = currentTitle + " " + shortUrl;
					self.jContentPost.val(self.contentPost);
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
				logged = true;
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