var fluigExtension = {

  serverUrl: "http://fluig.totvs.com",
  apiPublicPath : "/api/public/",
  
  postUrl: this.serverUrl + this.apiPublicPath + "social/post/create/with/upload",
  loggedUserUrl: this.serverUrl + this.apiPublicPath + "social/user/logged", 

  requestPost: function() {
    var request = new XMLHttpRequest();
    request.open("POST", this.postUrl, true);
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify({text:"texto"}));
  },
  
  requestLoggedUser: function() {
    var request = new XMLHttpRequest();
    request.open("GET", this.loggedUserUrl, true);
    request.setRequestHeader("Content-type","application/json");
    request.send(null);
  },

  init: function(){
	  var publishButton = document.getElementById("fluig_publish_button");
	  publishButton.onclick = this.requestPost;
  }
};

document.addEventListener('DOMContentLoaded', function () {
	fluigExtension.init();
});