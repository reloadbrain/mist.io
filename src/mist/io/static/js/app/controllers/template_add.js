define('app/controllers/template_add', ['ember'],
    //
    //  Template Add Controller
    //
    //  @returns Class
    //
    function () {

        'use strict';

        var GITHUB_URL = 'https://github.com/';

        return Ember.Object.extend({

            newTemplate: Ember.Object.create({
                name: '',
                url: '',
                type: {},
                entryPoint: '',
                text: '',
                source: {},
                description: '',
            }),


            open: function () {
                this.clear();
                this.view.clear();
            },


            add: function () {
                var that = this;
                Mist.templatesController.addTemplate({
                    template: that.get('newTemplate'),
                    callback: function (success) {
                        if (success) {
                            $('#add-template').collapsible('collapse');
                            Ember.run.next(function() {
                                $('body').enhanceWithin();
                            })
                        }
                    }
                })
            },


            close: function () {
                this.clear();
                this.view.clear();
            },


            clear: function () {
                this.get('newTemplate').setProperties({
                    name: '',
                    url: '',
                    type: this.view.templateTypes[1],
                    entryPoint: '',
                    text: '',
                    source: '',
                    template: '',
                    description: '',
                });
            },


            urlObserver: function () {
                if (this.get('newTemplate').get('source').value == 'github')
                    if (this.get('newTemplate').get('url').indexOf(GITHUB_URL) != 0)
                        this.get('newTemplate').set('url', GITHUB_URL);
            }.observes('newTemplate.url', 'newTemplate.source')
        });
    }
);
