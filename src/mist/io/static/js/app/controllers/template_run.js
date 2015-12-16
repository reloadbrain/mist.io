define('app/controllers/template_run', ['ember'],
    //
    //  Template Run Controller
    //
    // @returns Class
    //
    function () {

        'use strict';

        return Ember.Object.extend({

            templateToRun: Ember.Object.create({
                template: {},
                machine: '',
                parameters: ''
            }),

            open: function (template) {
                this.clear();
                this.get('templateToRun').set('template', template);
                this.view.open();
            },

            close: function () {
                this.view.close();
                this.clear();
            },

            clear: function () {
                this.get('templateToRun').setProperties({
                    template: {},
                    machine: '',
                    parameters: '',
                });
            },

            run: function () {
                var that = this;
                Mist.templatesController.runTemplate({
                    template: this.get('templateToRun'),
                    callback: function (success) {
                        if (success)
                            that.close();
                    }
                });
            },

        });
    }
);
