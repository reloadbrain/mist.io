(function($) {
    $.fn.mdPopup = function(options) {
        if (options == 'open') {
            $(this).addClass('md-show');
            console.log('open');
        }

        if (options == 'close') {
            $(this).removeClass('md-show');
            console.log('close');
        }
    };
}(jQuery));
