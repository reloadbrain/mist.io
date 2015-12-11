define('app/views/template_list', ['app/views/page'],
    //
    //  Template List View
    //
    //  @returns Class
    //
    function (PageView) {

        'use strict';

        return App.TemplateListView = PageView.extend({

            templateName: 'template_list',
            controllerName: 'templatesController',

            load: function () {

                // Add event listeners
                Mist.templatesController.on('onSelectedChange', this, 'updateFooter');

                this.updateFooter();

            }.on('didInsertElement'),


            unload: function () {

                // Remove event listeners
                Mist.templatesController.off('onSelectedChange', this, 'updateFooter');

            }.on('willDestroyElement'),

            canRename: function () {
                return Mist.templatesController.get('selectedObjects').length == 1;
            }.property('Mist.templatesController.model.@each.selected'),

            canDelete: function () {
                return Mist.templatesController.get('selectedObjects').length;
            }.property('Mist.templatesController.model.@each.selected'),

            updateFooter: function () {
                if (Mist.templatesController.get('selectedObjects').length) {
                    this.$('.ui-footer').slideDown();
                }else {
                    this.$('.ui-footer').slideUp();
                }
            },


            //
            //
            //  Actions
            //
            //


            actions: {

                addClicked: function () {
                    Mist.templateAddController.open();
                },

                editClicked: function () {
                    Mist.templateEditController.open(Mist.templatesController.get('selectedObjects')[0]);
                },

                selectClicked: function () {
                    $('#select-templates-popup').popup('open');
                },

                selectionModeClicked: function (mode) {
                    $('#select-templates-popup').popup('close');
                    Ember.run(function () {
                        Mist.templatesController.get('filteredTemplates').forEach(function (template) {
                            template.set('selected', mode);
                        });
                    });
                },

                deleteClicked: function () {

                    var templates = Mist.templatesController.get('selectedObjects');

                    Mist.dialogController.open({
                        type: DIALOG_TYPES.YES_NO,
                        head: 'Delete templates',
                        body: [
                            {
                                paragraph: 'Are you sure you want to delete ' + (templates.length > 1 ? 'these templates: ' : 'this template: ') + templates.toStringByProperty('name') + ' ?'
                            }
                        ],
                        callback: function (didConfirm) {
                            if (!didConfirm) return;
                            templates.forEach(function (template) {
                                Mist.templatesController.deleteTemplate({
                                    template: template
                                });
                            });
                        }
                    });
                },

                clearClicked: function() {
                    Mist.templatesController.clearSearch();
                },

                sortBy: function (criteria) {
                    Mist.templatesController.set('sortByTerm', criteria);
                }
            }
        });
    }
);
