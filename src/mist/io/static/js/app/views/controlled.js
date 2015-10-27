define('app/views/controlled', [],
    //
    //  Controlled View
    //
    //  @returns Class
    //
    function () {

        'use strict';

        return Ember.Component.extend({

            //
            //  Properties
            //

            controllerName: null,


            //
            //  Initialization
            //

            init: function () {
                this._super();
                if (!this.get('controllerName')){
                    this.set('controllerName', this.getControllerName());
                }

                var that = this;
                Ember.run.scheduleOnce('afterRender', this, function() {
                    var element = this.$();
                    if (element)
                        element.enhanceWithin();

                    $("[data-role='collapsible']").collapsible({
                        collapse: function(event) {
                            $(this).children().next().slideUp(250);
                            var id = $(this).attr('id'),
                            overlay = id ? $('#' + id+'-overlay') : false;
                            if (overlay) {
                                overlay.removeClass('in').addClass('ui-screen-hidden');
                            }
                        },
                        expand: function(event, ui) {
                            var id = $(this).attr('id'),
                            overlay = id ? $('#' + id+'-overlay') : false;

                            $(this).children().next().hide();
                            $(this).children().next().slideDown(250);

                            if ($(this).parents('#no-collection').length) {
                                if (overlay && overlay.hasClass('ui-screen-hidden')) {
                                    $('.ui-page').animate({scrollTop : $(this).offset().top}, 'slow');
                                }
                            }

                            if (overlay) {
                                overlay.removeClass('ui-screen-hidden').addClass('in');
                            }
                        }
                    });
                });
            },

            didInsertElement: function () {
                this._super();
                var controller = Mist.get(this.controllerName);
                if (!controller)
                    warn('cannot find ', this.controllerName);
                if (controller) {
                    controller.set('view', this);
                }
            },


            willDestroyElement: function () {
                this._super();
                var controller = Mist.get(this.controllerName);
                if (controller)
                    controller.set('view', null);
            }
        });
    }
);
