define('app/views/template_run', ['app/views/popup'],
    //
    //  Template Run View
    //
    //  @returns Class
    function (PopupComponent) {

        'use strict';

        return App.TemplateRunComponent = PopupComponent.extend({

            layoutName: 'template_run',
            controllerName: 'templateRunController',
            popupId: '#template-run',

            isReady: function () {
                return Mist.templateRunController.templateToRun.machine.id;
            }.property('Mist.templateRunController.templateToRun.machine'),

            //
            //  Actions
            //

            actions: {
                machineClicked: function (machine) {
                    Mist.templateRunController.get('templateToRun').set('machine', machine);
                    $('#template-run-machine').collapsible('collapse');
                },
                backClicked: function () {
                    Mist.templateRunController.close();
                },
                runClicked: function () {
                    Mist.templateRunController.run();
                }
            }
        });
    }
);
