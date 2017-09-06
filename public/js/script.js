var OAuthKey, 
appIdKey, 
blogID;



$(document).ready(function() {

    $("#sidebar-new").click(function(){
        $("#new-post").slideDown();
        $("#new-post input:first").focus();
    });

    $("textarea").on("input", function(){
        $(this).height(0);
        $(this).height($(this)[0].scrollHeight);
    });

});



$.ajax({
  url: "config/config.json",
  dataType: "json",
  success: function(configData) {
    appIdKey = configData.appIdKey;
    OAuthKey = configData.OAuthKey;
    blogID = configData.blogID;
    postBlogEntry();
    getBlogData(appIdKey);
  },
  error: function() {
    console.log("Couldn't get Access Token");
    console.log(appIdKey);
  }
});

function getData(appIdKey){
  $.ajax({
    url: "https://www.googleapis.com/blogger/v3/blogs/" + blogID + "/posts?key="+ appIdKey,
    dataType: "jsonp",
    success: function(data){
      console.log(data);
    },
    error: function(){
      console.log("something went wrong.");
    }
  });
}





// Client ID
// 137837267263-sinug9ofd0i0j1evo9ffb9e9oa6dmb3q.apps.googleusercontent.com
// Client Secret
// IYQq1NOGnU7mytFL4pSmAURe

// API Key
// AIzaSyDr5dEHyJ6dc76FMCAl-1TZ434fZ1-MaN8