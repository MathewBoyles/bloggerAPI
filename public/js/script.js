var config, token;

$(document).ready(function() {

    $.getJSON("/config.json", function(data){
        config = data;
        init();
    });

    $("#sidebar-new").click(function(){
        if(!token) {
            window.location = "/auth";
            return;
        }
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

            $.ajax({ 
                url: "/post",
                data: {
                    title: $("#post-title").val(),
                    content: $("#post-text").val(),
                    token: token
                },
                success: function(data){
                    console.log(data);

                    setTimeout(loadPosts, 1000);
                }
            });
        }
    });

    if(parseQueryString()["code"]) {
        setTimeout(function(){
            $.ajax({
                url: "/gettoken",
                data: {
                    code: parseQueryString()["code"]
                },
                success: function(data){
                    if(data == "error") alert("Auth error");
                    else {
                        token = data;
                        sessionStorage.setItem("batsblog__token", data);
                        $("#new-post").slideDown();
                        $("#new-post input:first").focus();
                    }

                    history.pushState(document.title, {}, "/");
                }
            });
        }, 1000);
    }
});

function init(){
    loadPosts();

    setInterval(loadPosts, 30000);
}

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

function parseQueryString() {
    var urlParams = {};
    window.location.search.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
            urlParams[$1] = $3;
        }
    );

    return urlParams;
}

token = sessionStorage.getItem("batsblog__token");