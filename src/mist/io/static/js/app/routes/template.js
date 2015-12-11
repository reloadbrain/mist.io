define('app/routes/template', ['app/routes/base'],
    //
    //  Template Route
    //
    //  @returns Class
    //
    function (BaseRoute) {

        'use strict';

        return App.TemplateRoute = BaseRoute.extend({

            activate: function () {
                this._super();
                Ember.run.next(this, function () {
                    var model = this.modelFor('template');
                    var id = model._id || model.id;
                    var template = Mist.templatesController.getObject(id);
                    Mist.logsController.view.set('filterString', id);
                    this.set('documentTitle', 'mist.io - ' + (template ? template.name : id));
                });
                Ember.run.later(function(){
                    Mist.logsController.load();
                }, 200);
            },

            redirect: function (template) {
                Mist.templatesController.set('templateRequest', template._id);
            },

            model: function (args) {
                var id = args.template_id;
                if (Mist.templatesController.loading)
                    return {_id: id};
                return Mist.templatesController.getObject(id);
            },

            exit: function() {
                Mist.logsController.unload();
            }
        });
    }
);
