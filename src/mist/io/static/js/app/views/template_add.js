define('app/views/template_add', ['app/views/controlled'],
    //
    //  Template Add View
    //
    //  @returns Class
    //
    function (ControlledComponent) {

        'use strict';

        var DEFAULT_URL = 'http://';
        var DEFAULT_GITHUB_URL = 'https://github.com/owner/repo';
        var DEFAULT_CLOUDIFY_BLUEPRINT = 'tosca_definitions_version: cloudify_dsl_1_1\n'+
            'imports:\n'+
            '    - http://www.getcloudify.org/spec/cloudify/3.3m5/types.yaml\n'+
            'inputs:\n'+
            '    mist_uri:\n'
            '        description: The mist custom uri\n'
            '        default: ""'


        return App.TemplateAddComponent = ControlledComponent.extend({

            //
            //  Properties
            //

            layoutName: 'template_add',
            controllerName: 'templateAddController',

            templateTypes: [{
                label: 'Cloudify Blueprint',
                value: 'cloudify'
            }],

            templateSources: [{
                label: 'Github',
                value: 'github'
            }, {
                label: 'URL',
                value: 'url',
            }, {
                label: 'Inline',
                value: 'inline'
            }],


            //
            //  Computed Properties
            //

            isReady: function () {
                var template = Mist.templateAddController.get('newTemplate');
                var name = template.get('name');
                var type = template.get('type');
                var source = template.get('source');
                if (!type || !source || !name)
                    return false;
                if (source.value == 'inline')
                    return template.get('template');
                return template.get('url');
            }.property(
                'Mist.templateAddController.newTemplate.name',
                'Mist.templateAddController.newTemplate.source',
                'Mist.templateAddController.newTemplate.type',
                'Mist.templateAddController.newTemplate.url',
                'Mist.templateAddController.newTemplate.template'
            ),

            isInline: function(){
                return Mist.templateAddController.newTemplate.source.value == 'inline';
            }.property('Mist.templateAddController.newTemplate.source'),

            isURL: function(){
                return Mist.templateAddController.newTemplate.source.value == 'url';
            }.property('Mist.templateAddController.newTemplate.source'),

            isGitHub: function(){
                return Mist.templateAddController.newTemplate.source.value == 'github';
            }.property('Mist.templateAddController.newTemplate.source'),

            load: function () {
               Ember.run.next(function(){
                   $( "#add-template" ).collapsible({
                       expand: function(event, ui) {
                           Mist.templateAddController.open();

                           var id = $(this).attr('id'),
                           overlay = id ? $('#' + id+'-overlay') : false;
                           if (overlay) {
                               overlay.removeClass('ui-screen-hidden').addClass('in');
                           }
                           $(this).children().next().hide();
                           $(this).children().next().slideDown(250);
                       }
                   });
               });
            }.on('didInsertElement'),


            unload: function () {
               Ember.run.next(function(){
                   $( "#add-template" ).collapsible({
                       collapse: function(event, ui) {
                           Mist.templateAddController.close();

                           $(this).children().next().slideUp(250);
                           var id = $(this).attr('id'),
                           overlay = id ? $('#' + id+'-overlay') : false;
                           if (overlay) {
                               overlay.removeClass('in').addClass('ui-screen-hidden');
                           }
                       }
                   });
               });
            }.on('willDestroyElement'),


            //
            //  Methods
            //

            clear: function () {
                this.closeTypeSelect();
                this.closeSourceSelect();
            },

            selectType: function (type) {
                this.closeTypeSelect();
                Mist.templateAddController.get('newTemplate').set('type', type);
                this.setTemplate();
            },

            setTemplate: function () {
                var newTemplate = Mist.templateAddController.get('newTemplate');
                var type = newTemplate.get('type');
                if (type.value == 'cloudify')
                    newTemplate.set('template', DEFAULT_CLOUDIFY_BLUEPRINT);
            },

            selectSource: function (source) {
                this.closeSourceSelect();
                this.showSourceBundle(source);
                var newTemplate = Mist.templateAddController.get('newTemplate');
                newTemplate.set('source', source);
                if (source.value == 'url')
                    newTemplate.set('url', DEFAULT_URL);
                if (source.value == 'github')
                    newTemplate.set('url', DEFAULT_GITHUB_URL);
                if (source.value == 'inline')
                    this.setTemplate();

                Ember.run.next(function(){
                    $('body').enhanceWithin();
                });
            },

            closeTypeSelect: function () {
                this.$('#template-add-type .mist-select').collapsible('collapse');
            },

            closeSourceSelect: function () {
                this.$('#template-add-source .mist-select').collapsible('collapse');
            },

            showSourceBundle: function (source) {
                this.$('.'+source.value).slideDown();
                this.$('#template-add-description').slideDown();
            },


            //
            //  Actions
            //

            actions: {
                clickOverlay: function() {
                    $('#add-template').collapsible('collapse');
                },

                selectType: function (type) {
                    this.selectType(type);
                },

                selectSource: function (source) {
                    this.selectSource(source);
                },

                backClicked: function () {
                    Mist.templateAddController.close();
                },

                addClicked: function () {
                    Mist.templateAddController.add();
                }
            },
        });
    }
);
