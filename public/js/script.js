var config;

$(document).ready(function() {

    $.getJSON("/config.json", function(data){
        config = data;
        init();
    });

    $("#sidebar-new").click(function(){
        $("#new-post").slideDown();
        $("#new-post input:first").focus();
    });

    $("textarea").on("input", function(){
        $(this).height(0);
        $(this).height($(this)[0].scrollHeight);
    });

    $("#cancel-post").click(function(){
        $("#new-post").slideUp();
    });

    $("#create-post [required]").removeAttr("required").attr("data-required", "1");

    $("#create-post").submit(function(event){
        event.preventDefault();

        var imageError = false;
        if($(this).find("[name=\"image\"]")[0].files[0]) {
            var file = $(this).find("[name=\"image\"]")[0].files[0];
            var fileType = file["type"];
            var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
            if ($.inArray(fileType, ValidImageTypes) < 0) imageError = true;
        }

        if($(":input[data-required]").filter(function(){
            return !$(this).val();
        }).length) {
            $("#post-error").html("Please enter all required fields.").show();
        } else if(imageError) {
            $("#post-error").html("Invalid file type. Images only.").show();
        } else {
            $("#post-error").hide();
            alert("Good");
        }
    });
});

function init(){
    loadPosts();
    gapi.load("client", start);

    setInterval(loadPosts, 30000);
}

function start() {
  gapi.client.init({
    "apiKey": config.apiKey,
    "discoveryDocs": ["https://people.googleapis.com/$discovery/rest"],
    "clientId": config.clientID,
    "scope": "profile",
  }).then(function() {
    return gapi.client.people.people.get({
      "resourceName": "people/me",
      "requestMask.includeField": "person.names"
    });
  }).then(function(response) {

  }, function(reason) {
    console.log("Error", reason);
  });
};

function loadPosts(){
    $.ajax({
        url: "https://www.googleapis.com/blogger/v3/blogs/"+config.blogID+"/posts",
        data: {
            key: config.apiKey
        },
        success: function(data){
            $("#posts").empty();
            $.each(data.items, function(i, post){

                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var lastUpdatedDate = new Date(post.updated);
                var lastUpdated = months[lastUpdatedDate.getMonth()] + " " + lastUpdatedDate.getDate() + ", " + lastUpdatedDate.getFullYear();

                var $el = $("<div>");
                $el
                    .addClass("card")
                    .append("<div>")
                    .find("div:last")
                        .addClass("card-body")
                        .append("<h4>")
                        .find("h4:last")
                            .addClass("card-title")
                            .html(post.title)
                            .parent()
                        .append("<div>")
                        .find("div:last")
                            .html(post.content)
                            .parent()
                        .append("<hr />")
                        .append("<small>")
                        .find("small:last")
                            .addClass("text-muted")
                            .html("Last updated: " + lastUpdated + " by <a href=\"" + post.author.url + "\" target=\"_blank\">" + post.author.displayName + "</a>");
                $("#posts").append($el);
                delete $el;
            });
        }
    })
}
