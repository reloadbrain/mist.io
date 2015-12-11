define('app/views/template', ['app/views/page'],
    //
    //  Template View
    //
    //  @returns Class
    //
    function (PageView) {

        'use strict';

        return App.TemplateView = PageView.extend({

            templateName: 'template',

            //
            //  Computed Properties
            //

            isInline: function () {
                var template = this.get('model');
                if (!template.id) return false;
                return template.get('source') == 'inline';
            }.property('controller.model.source'),


            model: function () {
                return this.get('controller').get('model');
            }.property('controller.model'),


            //
            //  Initialization
            //

            load: function () {

                // Add event listeners
                Mist.templatesController.on('onChange', this, 'updateView');
                this.updateView();

            }.on('didInsertElement'),


            unload: function () {

                // Remove event listeners
                Mist.templatesController.on('onChange', this, 'updateView');

            }.on('willDestroyElement'),


            //
            //  Methods
            //

            updateView: function () {

                this.updateModel();

                if (Mist.templatesController.objectExists(
                    this.get('model').id)) {
                        // Nothing else matters
                }
            },


            updateModel: function () {
                var template = Mist.templatesController.getRequestedTemplate();
                if (template)
                    this.get('controller').set('model', template);
            },


            //
            //  Actions
            //

            actions: {

                runClicked: function () {
                    Mist.templateRunController.open(this.get('model'));
                },


                editClicked: function () {
                    Mist.templateEditController.open(this.get('model'));
                },


                deleteClicked: function () {

                    var template = this.get('model');

                    Mist.dialogController.open({
                        type: DIALOG_TYPES.YES_NO,
                        head: 'Delete template',
                        body: [
                            {
                                paragraph: 'Are you sure you want to delete "' +
                                    template.name + '" ?'
                            }
                        ],
                        callback: function (didConfirm) {
                            if (!didConfirm) return;
                            Mist.templatesController.deleteTemplate({
                                template: template,
                                callback: function (success) {
                                    if (!success) return;
                                    Mist.__container__.lookup('router:main').transitionTo('templates');
                                }
                            })
                        }
                    });
                }
            }
        });
    }
);
