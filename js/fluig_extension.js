var fluigExtension = {
	
	serverUrl: "http://10.80.81.96:8080",
	jProgress: null,
	jContent: null,
	
	init : function() {
		var self = this;
		self.jProgress = $('#progress');
		self.jContent = $('#fluig_content_post');
		
		$(document).ajaxStart(function() {
			self.updateProgress(0, 50, 1000);
		});
		
		$(document).ajaxComplete(function(event,request, settings) {
			self.updateProgress(50, 105, 1000);
		});
		
		
		if(self.isLogged() == true){
			$('#fluig_extension_login').hide();
			$('#fluig_extensin_content').show();
		}else{
			$('#fluig_extensin_content').hide();
			$('#fluig_extension_login').show();
			$('#login_fluig').attr('href', self.serverUrl + '/portal');
		}
		
		jQuery.urlShortener.settings.apiKey='AIzaSyD50283xRGCwMj3Qmk_qu19v5FyteAGZ-Q';
		
		var currentUrl = null;
		var currentTitle = null;
		var contentPost = null;
		
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			currentUrl = tabs[0].url;
			currentTitle = tabs[0].title;

			jQuery.urlShortener({
				longUrl: currentUrl,
				success: function (shortUrl) {
					contentPost = currentTitle + " " + shortUrl;
					self.jContent.html(contentPost);
				}
			});
		});
		
		
		$('#fluig_publish_button').click(function(){
			self.jContent.attr('disabled','true');
			
	    	$.ajax({
				type: "POST",
				async: true,
				url: self.serverUrl + "/api/public/social/post/create",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({text: contentPost}),
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
		var jPost = $('#fluig_publish_button');
		jPost.css('padding-left', '0.8571em');
		jPost.css('background-image', 'none');

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