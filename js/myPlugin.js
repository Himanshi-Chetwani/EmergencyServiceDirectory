(function ($) {

    $.fn.slideFadeOut = function (speed, callback) {
        return this.animate(
            {
                height: "hide",
                opacity: "hide"
            },
            speed,
            callback
        );
    };
})(jQuery);


