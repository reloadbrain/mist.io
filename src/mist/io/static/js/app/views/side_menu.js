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


            load: function () {
                this._renderPanel();
                this._handleWindowResize();
            }.on('didInsertElement'),


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


            //
            //
            // Pseudo-Private Methods
            //
            //


            _renderPanel: function () {
                Ember.run.next(this, function () {
                    $(this.element).trigger('create');
                    if (!$('#side-menu-navigation').hasClass('ui-listview'))
                        Ember.run.later(this, function () {
                            this._renderPanel();
                        }, 100);
                });
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
