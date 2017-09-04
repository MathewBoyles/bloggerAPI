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
