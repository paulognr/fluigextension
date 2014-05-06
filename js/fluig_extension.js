var fluigExtension = {
	init : function() {
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
					$('#fluig_content_post').html(contentPost);
				},
				error: function(err) {
					$('#fluig_content_post').html("Ops! Não podemos postar esse link! =/");
				}
			});
		});
		
		$('#fluig_publish_button').click(function(){
	    	$.ajax({
				type: "POST",
				async: true,
				url: "http://10.80.81.96:8080/api/public/social/post/create",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({text: contentPost}),
				success: function(data){
					console.log("feito: " + data);
				},
				error: function(data){
					console.log("Erro: " + data);
				}
			});
		});
	}
};

document.addEventListener('DOMContentLoaded', function() {
	fluigExtension.init();
});