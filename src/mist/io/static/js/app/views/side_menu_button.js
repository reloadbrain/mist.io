define('app/views/side_menu_button', ['app/views/templated', 'ember'],
    //
    //  Side Menu Button View
    //
    //  @returns Class
    //
    function (TemplatedView) {

        'use strict';

        return TemplatedView.extend({


            //
            //
            //  Actions
            //
            //


            actions: {

                menuClicked: function () {
                    Mist.sideMenuController.open();
                }
            }
        })
    }
)
