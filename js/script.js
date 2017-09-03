$(document).ready(function() {

    // dummy content w/ endless scroll
    (function() {
        while ($(document).height() <= ($(window).height() + 10)) {
          $("#main").append("<hr />");
        }

        $(window).on("scroll", function() {
          if ($(window).scrollTop() >= ($(document).height() - $(window).height())) {
            $("#main").append("<hr />");
          }
        });
    }());

});
