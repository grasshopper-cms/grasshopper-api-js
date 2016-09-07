/*global define:false*/
define(['text!views/login/template.html', 'login/model', 'appBinders'], function (template, loginModel, appBinders) {
    'use strict';

    return {
        name : 'loginView',
        modelData : {},
        // for model attribute errors on self validating models, follow the convention of attribute+"Error".
        // See the rivetView "publish" method
        ModelType : loginModel,
        browserTitle : 'Sign In',
        appendTo : '#stage',
        wrapper : false,
        template : template,
        rivetsConfig : {
            binders : [appBinders]
        }
    };
});
