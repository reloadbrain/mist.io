define('app/models/network', ['ember'],
    //
    //  Network Model
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


            id: null,
            name: null,
            status: null,
            subnets: null,
            backend: null,
            selected: null,

            hasSubnets: function () {
                return this.subnets instanceof Array ? !!this.subnets.length : false;
            }.property('subnets'),
        });
    }
);
