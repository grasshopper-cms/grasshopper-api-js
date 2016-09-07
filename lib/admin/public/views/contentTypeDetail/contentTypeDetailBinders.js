/* jshint loopfunc:true */
define(['fieldAccordionView'],
    function (FieldAccordionView) {
        'use strict';

        return {
            fieldaccordion : {
                bind : function() {},
                unbind : function() {
                    this.viewInstance.remove();
                },
                routine : function(el, model) {
                    var parentView = this.model.view;

                    if (this.viewInstance) {
                        this.model.view.removeChild(this.viewInstance);
                        this.viewInstance.remove();
                    }

                    model.set('contentTypeId', parentView.model.get('_id'), { silent : true });

                    this.viewInstance = new FieldAccordionView({
                        appendTo : el,
                        model : model
                    });

                    parentView.addChild(this.viewInstance);
                }
            }
        };

    });
