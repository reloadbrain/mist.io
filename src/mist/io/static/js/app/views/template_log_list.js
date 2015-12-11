define('app/views/template_log_list', ['app/views/log_list'],
    //
    //  Template Log List View
    //
    //  @returns Class
    //
    function (LogListComponent) {

        'use strict';

        return App.TemplateLogListComponent = LogListComponent.extend({

            layoutName: 'template_log_list',

            filterString: '',

            extraParams: Ember.Object.create({
              template_id: ''
            }),

            search: function () {
                if (this.get('filterString') === undefined)
                    return;
                this.get('extraParams').set('template_id', this.get('filterString'));
                this._super();
            }
        });
    }
);
