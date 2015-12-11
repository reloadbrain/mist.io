define('app/views/template_edit', ['app/views/popup'],
    //
    //  Template Edit View
    //
    //  @returns Class
    //
    function (PopupComponent) {

        'use strict';

        return App.TemplateEditComponent = PopupComponent.extend({

            layoutName: 'template_edit',
            controllerName: 'templateEditController',
            popupId: '#template-edit-popup',


            //
            //  Methods
            //


            updateSaveButton: function () {
                if (Mist.templateEditController.formReady) {
                    $('#template-edit-ok').removeClass('ui-state-disabled');
                } else {
                    $('#template-edit-ok').addClass('ui-state-disabled');
                }
            },


            //
            //  Actions
            //

            actions: {

                backClicked: function () {
                    Mist.templateEditController.close();
                },

                saveClicked: function () {
                    Mist.templateEditController.save();
                }
            },


            //
            // Observers
            //


            updateSaveButtonObserver: function () {
                Ember.run.once(this, 'updateSaveButton');
            }.observes('Mist.templateEditController.formReady')
        });
    }
);
