define('app/views/side_menu', ['app/views/controlled'],
    //
    //  Side Menu View
    //
    //  @returns Class
    //
    function (ControlledView) {

        'use strict';

        return ControlledView.extend({


            //
            //
            //  Properties
            //
            //


            element: '#side-menu',
            elementOverlay: '#side-menu-overlay',


            //
            //
            //  Initialization
            //
            //


            init: function () {
                this._super();
                this._handleWindowResize();
            },


            //
            //
            //  Methods
            //
            //


            open: function () {
                $(this.element).css('left', 0);
                if ($(window).width() <= 700)
                    $(this.elementOverlay).show();
            },


            close: function () {
                $(this.element).css('left', '-' + $(this.element).width() + 'px');
                $(this.elementOverlay).hide();
            },


            _handleWindowResize: function () {
                $(window).resize(function () {
                    if ($(window).width() > 700)
                        Mist.sideMenuController.open();
                    else
                        Mist.sideMenuController.close();
                });
            },


            //
            //
            //  Actions
            //
            //


            actions: {

                overlayClicked: function () {
                    Mist.sideMenuController.close();
                }
            }
        });
    }
);
