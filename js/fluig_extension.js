var fluigExtension = {
	
	serverUrl: null,
	KEY_SERVER_URL: "fluigextension.serverurl",

	jContentPost: null,	
	jProgress: null,
	jPublishButton: null,
	jStartLoad: null,
	jTop: null,
	
	contentPost: "",
	
	loadJsFiles: function(){
		var self = this;
		setTimeout(function(){
			self.loadJsFile("../js/jquery-2.1.1.min.js", function(){
				self.loadJQueryObjects();
				self.loadJsFile("../js/jquery.urlshortener.min.js", function(){
					self.init();
				});
			});
		}, 1000);
	},
	
	init : function() {
		var self = this;
		self.loadJQueryObjects();
		self.loadJQueryEvents();
		self.loadServerUrl();
		self.loadTop();
		
		if(self.serverUrl){
			self.jTop.removeClass('full-height');
		}else{
			self.jTop.addClass('full-height');
		}
		
		/*var jExtension = $('#fluig_extensin_content');
		var jLogin = $('#fluig_extension_login');
		
		if(self.isLogged() == true){
			jLogin.hide();
			self.jStartLoad.fadeOut(function(){
				$('html').css('background-color','#EBEBEB');
				jExtension.show();
			});
			
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
		}*/
	},
	
	loadTop: function(){
		var self = this;
		self.jStartLoad.fadeOut(function(){
			self.jTop.fadeIn();
		});
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
	
	setServerUrl: function(serverUrl){
		var self = this;
		self.serverUrl = serverUrl;
		localStorage.setItem(self.KEY_SERVER_URL, serverUrl);
	},
	
	loadServerUrl: function(){
		var self = this;
		self.serverUrl = localStorage.getItem(self.KEY_SERVER_URL);
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
		self.jTop = $('#fluig_extension_top');
	},
	
	loadJQueryEvents: function(){
		var jServerVal = $('#server_val');
		jServerVal.mouseover(function(){
			$(this).find('span').css('opacity', '1');
		});
		
		jServerVal.mouseout(function(){
			$(this).find('span').css('opacity', '0');
		});
		
		var jServerValInput = $('#serval_val_input');
		var jEditServer = $('#edit_server');
		jEditServer.click(function(){
			jServerVal.addClass('active');
			jServerValInput.show();
		});
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
	fluigExtension.loadJsFiles();
});