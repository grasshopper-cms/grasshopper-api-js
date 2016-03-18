/*global define:false*/
define(['text!views/contentTypeDetail/fieldAccordion/template.html', 'fieldAccordionBinders'],
    function (template, fieldAccordionBinders) {
        'use strict';

        return {
            name : 'fieldAccordion',
            modelData : {},
            wrapper : false,
            template : template,
            events : {},
            listeners : [
                ['model', 'change:type', 'changeFieldType'],
                ['model', 'change:selectedValidation', 'addValidationRule']
            ],
            rivetsConfig : {
                binders : [fieldAccordionBinders]
            }
        };

    });
