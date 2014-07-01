define('app/controllers/side_menu', ['ember'],
    //
    //  Side Menu Controller
    //
    //  @returns Class
    //
    function () {

        'use strict';

        return Ember.Object.extend({


            //
            //
            //  Properties
            //
            //


            view: null,


            //
            //
            //  Methods
            //
            //


            open: function () {
                this.view.open();
            },


            close: function () {
                this.view.close();
            }
        });
    }
);
