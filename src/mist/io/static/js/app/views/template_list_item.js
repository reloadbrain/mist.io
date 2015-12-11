define('app/views/template_list_item', ['app/views/list_item'],
    //
    //  Template List Item View
    //
    //  @returns Class
    //
    function (ListItemComponent) {

        'use strict';

        return App.TemplateListItemComponent = ListItemComponent.extend({

            layoutName: 'template_list_item',

            updateCheckbox: function () {
                var element = $('#' + this.elementId + ' input.ember-checkbox');
                Ember.run.next(this, function () {
                    if (element.checkboxradio) {
                        element.checkboxradio()
                               .checkboxradio('refresh');
                    }
                });
            },

            selectedObserver: function () {
                Ember.run.once(this, 'updateCheckbox');
            }.observes('template.selected')
        });
    }
);
