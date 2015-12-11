define('app/controllers/templates', ['app/controllers/base_array', 'app/models/template'],
    //
    //  Templates Controller
    //
    //  @returns Class
    //
    function (BaseArrayController, TemplateModel) {

        'use strict';

        return BaseArrayController.extend({

            baseModel: TemplateModel,
            searchTerm: null,
            sortByTerm: 'name',

            //
            //  Computed Properties
            //

            sortByName: Ember.computed('sortByTerm', function () {
                return this.get('sortByTerm') == 'name';
            }),

            sortByType: Ember.computed('sortByTerm', function () {
                return this.get('sortByTerm') == 'type';
            }),

            filteredTemplates: Ember.computed('model', 'searchTerm', function() {
                var filteredTemplates = [];

                if (this.searchTerm) {
                    var that = this;
                    this.model.forEach(function(template) {
                        var regex = new RegExp(that.searchTerm, 'i');

                        if (regex.test(template.name)) {
                            filteredTemplates.push(template);
                        } else {
                            if (template.selected) {
                                template.set('selected', false);
                            }
                        }
                    });
                } else {
                    filteredTemplates = this.model;
                }

                return filteredTemplates;
            }),

            sortedTemplates: Ember.computed('filteredTemplates', 'filteredTemplates.@each.name', 'filteredTemplates.@each.type', 'sortByTerm', function() {
                if(this.get('filteredTemplates'))
                {
                    if (this.get('sortByName'))
                    {
                        return this.get('filteredTemplates').sortBy('name');
                    }

                    if (this.get('sortByType'))
                    {
                        return this.get('filteredTemplates').sortBy('type');
                    }
                }
            }),

            addTemplate: function (args) {
                var that = this;
                that.set('addingTemplate', true);
                Mist.ajax.POST('/templates', {
                    'name': args.template.name,
                    'exec_type': args.template.type.value,
                    'location_type': args.template.source.value,
                    'entrypoint': args.template.entryPoint,
                    'template': args.template.source.value == 'inline' ? args.template.template : args.template.url,
                    'description': args.template.description
                }).success(function (template) {
                    that._addObject(template);
                }).error(function (message) {
                    Mist.notificationController.notify(message);
                }).complete(function (success) {
                    that.set('addingTemplate', false);
                    if (args.callback)
                        args.callback(success);
                })
            },

            deleteTemplate: function (args) {
                var that = this;
                that.set('deletingTemplate', true);
                Mist.ajax.DELETE('/templates/' + args.template.id, {
                }).success(function () {
                    that._deleteObject(args.template);
                }).error(function (message) {
                    Mist.notificationController.notify(message);
                }).complete(function (success) {
                    that.set('deletingTemplate', false);
                    if (args.callback)
                        args.callback(success);
                })
            },

            renameTemplate: function (args) {
                var that = this;
                that.set('renamingTemplate', true);
                Mist.ajax.PUT('/templates/' + args.template.id, {
                    new_name: args.newName,
                    new_description: args.newDescription
                }).success(function () {
                    that._renameTemplate(args.template, args.newName, args.newDescription);
                }).error(function (message) {
                    Mist.notificationController.notify(message);
                }).complete(function (success) {
                    that.set('renamingTemplate', false);
                    if (args.callback)
                        args.callback(success);
                });
            },

            runTemplate: function (args) {
                var that = this;
                that.set('runningTemplate', true);
                Mist.ajax.POST('/templates/' + args.template.template.id, {
                    'machine_id': args.template.machine.id,
                    'cloud_id': args.template.machine.cloud.id,
                    'params': args.template.parameters
                }).error(function (message) {
                    Mist.notificationController.notify(message);
                }).complete(function (success) {
                    that.set('runningTemplate', false);
                    if (args.callback)
                        args.callback(success);
                });
            },

            getTemplate: function(templateId) {
                return this.model.findBy('id', templateId);
            },

            getRequestedTemplate: function() {
                if (this.templateRequest) {
                    return this.getObject(this.templateRequest);
                }
            },

            clearSearch: function() {
                this.set('searchTerm', null);
            },

            _renameTemplate: function (template, name, description) {
                Ember.run(this, function () {
                    template.set('name', name);
                    if (description)
                        template.set('description', description);
                    this.trigger('onRename', {
                        template: template
                    });
                });
            }
        });
    }
);
