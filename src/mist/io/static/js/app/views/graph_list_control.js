define('app/views/graph_list_control', ['app/views/templated', 'jqmdate'],
    //
    //  Graph List Control View
    //
    //  @returns Class
    //
    function (TemplatedView, JqmDate) {

        'use strict';

        return App.GraphListControlView = TemplatedView.extend({


            //
            //
            //  Properties
            //
            //

            openPicker: '',
            selectedTimeWindow: '',

            timeWindowText: function () {
                if (Mist.graphsController.stream.isStreaming)
                    return this.get('selectedTimeWindow') || 'last 10 mins';
                var from = Mist.graphsController.fetchStatsArgs.from;
                var until = Mist.graphsController.fetchStatsArgs.until;
                if (!from || !until)
                    return '';
                var thisYear = new Date().getFullYear();
                from = new Date(from).getPrettyDateTime(true, true);
                from = from.replace(', ' + thisYear, '');
                until = new Date(until).getPrettyDateTime(true, true);
                until = until.replace(', ' + thisYear, '');
                return from + ' - ' + until;
            }.property(
                'Mist.graphsController.config.fetchStatsArgs',
                'Mist.clock.second'
            ),


            //
            //
            //  Initialization
            //
            //


            load: function () {
                Ember.run.next(this, function () {
                    // Make sure element is rendered
                    this.$().trigger('create');
                });
            }.on('didInsertElement'),


            //
            //
            //  Pseudo-Private Methods
            //
            //


            _openRangeSelectionPopup: function () {
                Ember.run.later(this, function () {
                    $('#pick-range').popup('open');
                    var until = Mist.graphsController.fetchStatsArgs.until;
                    var from = until - Mist.graphsController.config.timeWindow;
                    $('#range-from-date').datebox('setTheDate', new Date(from));
                    $('#range-from-time').datebox('setTheDate', new Date(from));
                    $('#range-to-date').datebox('setTheDate', new Date(until));
                    $('#range-to-time').datebox('setTheDate', new Date(until));
                    this.set('openPicker', '');
                }, 300);
            },


            _closeRangeSelectionPopup: function () {
                $('#pick-range').popup('close');
            },


            _validateRange: function (from, until) {
                if (from == 'Invalid Date') {
                    Mist.notificationController.timeNotify('Invalid Date: "From"', 2000);
                    return false;
                }
                if (until == 'Invalid Date') {
                    Mist.notificationController.timeNotify('Invalid Date: "To"', 2000);
                    return false;
                }
                if (until <= from) {
                    Mist.notificationController.timeNotify('Invalid Range', 2000);
                    return false;
                }
                var minRange = TIME_MAP.SECOND * 10 * DISPLAYED_DATAPOINTS;
                if (until - from < minRange) {
                    Mist.notificationController.timeNotify('Range is too narrow.' +
                        ' Must be at least: ' + parseInt(minRange / TIME_MAP.MINUTE) +
                        ' mins.' , 3000);
                    return false;
                }
                if (until.isFuture()) {
                    Mist.notificationController.timeNotify('Invalid Date: "To"', 2000);
                    return false;
                }
                return true;
            },


            _closeDateBoxes: function () {
                $('#range-from-date').datebox('close');
                $('#range-from-time').datebox('close');
                $('#range-to-date').datebox('close');
                $('#range-to-time').datebox('close');
            },


            _flipDateBox: function (selector) {
                var isOpen = this.get('openPicker') == selector;
                this._closeDateBoxes();
                if (!isOpen)
                    Ember.run.later(this, function () {
                        $(selector).datebox('open');
                        this.set('openPicker', selector);
                    }, 150);
                else {
                    this.set('openPicker', '');
                }
            },


            _extractRange: function () {
                return {
                    from: $('#range-from-date').datebox('getTheDate').mergeTime(
                        $('#range-from-time').datebox('getTheDate')),
                    until: $('#range-to-date').datebox('getTheDate').mergeTime(
                        $('#range-to-time').datebox('getTheDate'))
                }
            },


            //
            //
            //  Actions
            //
            //


            actions: {

                timeWindowClicked: function () {
                    $('#change-time-window').popup('open');
                },

                timeWindowChanged: function (newTimeWindow, title) {
                    $('#change-time-window').popup('close');
                    if (newTimeWindow == 'range') {
                        this._openRangeSelectionPopup();
                    } else {
                        Mist.graphsController.resolution.change(newTimeWindow);
                        this.set('selectedTimeWindow', title);
                    }
                },

                rangeFromDateClicked: function () {
                    this._flipDateBox('#range-from-date');
                },

                rangeFromTimeClicked: function () {
                    this._flipDateBox('#range-from-time');
                },

                rangeToDateClicked: function () {
                    this._flipDateBox('#range-to-date');
                },

                rangeToTimeClicked: function () {
                    this._flipDateBox('#range-to-time');
                },

                rangeOkClicked: function () {
                    var range = this._extractRange();
                    var from = range.from;
                    var until = range.until;
                    if (this._validateRange(from, until)) {
                        Mist.graphsController.history.change({
                            timeWindow: 'range',
                            from: from.getTime(),
                            until: until.getTime(),
                        });
                        Mist.graphsController.one('onFetchStats', this, callback);
                        Mist.graphsController.one('onFetchStatsError', this, function () {
                            Mist.graphsController.off('onFetchStats', this, callback);
                        });
                    }
                    function callback () {
                        this._closeRangeSelectionPopup();
                    }
                },

                rangeBackClicked: function () {
                    this._closeRangeSelectionPopup();
                },


                backClicked: function () {
                    Mist.graphsController.history.goBack();
                },


                forwardClicked: function () {
                    Mist.graphsController.history.goForward();
                }
            }
        });
    }
);
