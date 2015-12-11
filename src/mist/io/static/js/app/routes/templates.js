define('app/routes/templates', ['app/routes/base'],
    //
    //  Templates Route
    //
    //  @returns Class
    //
    function (BaseRoute) {

        'use strict';

        return App.TemplatesRoute = BaseRoute.extend({

            documentTitle: 'mist.io - templates',

            exit: function () {
                Mist.templatesController.model.setEach('selected', false);
            }
        });
    }
);
