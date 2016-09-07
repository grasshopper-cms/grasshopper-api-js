/*global define:false*/
define(['masseuse', 'modalViewConfig', 'underscore', 'jquery', 'constants',
    'text!views/modal/_imageModalView.html', 'text!views/modal/_inputModalView.html',
    'text!views/modal/_checkboxModalView.html', 'text!views/modal/_uploadModalView.html',
    'text!views/modal/modalView.html', 'text!views/modal/_radioModalView.html',
    'text!views/modal/_listModalView.html', 'text!views/modal/_errorModalView.html'],
    function (masseuse, modalViewConfig, _, $, constants,
              imageModalTemplate, inputModalTemplate,
              checkboxTemplate, uploadTemplate,
              defaultTemplate, radioTemplate,
              listTemplate, errorTemplate) {
        'use strict';
        var RivetView = masseuse.plugins.rivets.RivetsView,
        defaultViewOptions = [
                '$deferred',
                'type',
                'defaultBreadcrumbs',
                'defaultMastheadButtons',
                'breadcrumbs',
                'privateBreadcrumbs',
                'mastheadButtons',
                'permissions',
                'nodeId',
                'wrapper',
                'appendTo',
                'collection',
                'browserTitle'
            ];

        return RivetView.extend({
            defaultOptions : modalViewConfig,
            initialize : initialize,
            afterRender : afterRender,
            fireClickOnUploadFileInput : fireClickOnUploadFileInput,
            handleFileSelect : handleFileSelect,
            handleFileDrop : handleFileDrop,
            handleDragOver : handleDragOver,
            handleDragLeave : handleDragLeave,
            confirmModal : confirmModal,
            cancelModal : cancelModal,
            searchContentType : searchContentType
        });

        function initialize (options) {
            switch (options.type) {
            case 'image':
                options.template = imageModalTemplate;
                break;
            case 'input':
                options.template = inputModalTemplate;
                break;
            case 'checkbox':
                options.template = checkboxTemplate;
                break;
            case 'upload':
                options.template = uploadTemplate;
                break;
            case 'radio':
                options.template = radioTemplate;
                break;
            case 'list':
                options.template = listTemplate;
                break;
            case 'error':
                options.template = errorTemplate;
                break;
            default:
                options.template = defaultTemplate;
                break;
            }
            this.options = options;

            options.viewOptions = options.viewOptions || [];
            options.viewOptions =  options.viewOptions.concat(defaultViewOptions);

            this.options = options;

            RivetView.prototype.initialize.apply(this, arguments);
        }

        function afterRender () {
            if (this.options && this.options.type === 'input') {
                $('input', this.$el).focus();
            }

            if (this.model.get('withSearch')) {
                this.model.set('originalData', this.model.get('data'));
            }
        }

        function fireClickOnUploadFileInput (e) {
            e.stopPropagation();
            e.preventDefault();
            document.querySelector('#uploadFileInput').click();
        }

        function handleFileSelect (e) {
            var files = _.clone(this.model.attributes.files);

            _.each(e.target.files, function (file) {
                files.push(file);
            });

            updateFileModel.call(this, files);
        }

        function handleFileDrop (e) {
            e.stopPropagation();
            e.preventDefault();

            this.handleDragLeave(e);

            var files = _.clone(this.model.attributes.files);

            _.each(e.originalEvent.dataTransfer.files, function (file) {
                files.push(file);
            });

            updateFileModel.call(this, files);
        }

        function updateFileModel (files) {
            this.model.set('files', files);
        }

        function handleDragOver (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.className != 'active') {
                e.target.classList.add('active');
            }
            e.originalEvent.dataTransfer.dropEffect = 'copy';
        }

        function handleDragLeave (e) {
            e.target.classList.remove('active');
        }

        function confirmModal () {
            this.$deferred.resolve(this.model.attributes);
            _removeModal.call(this);
        }

        function cancelModal () {
            this.$deferred.reject();
            _removeModal.call(this);
        }

        function _removeModal () {
            this.remove();
        }

        function searchContentType (e) {
            var model = this.model,
                searchValue = $.trim(this.model.get('contentTypeSearchValue')).toLowerCase(),
                tmpModel;

            if (!_.isUndefined(e) && !_.isUndefined(constants.controlKeyCodeMap[e.keyCode])) {
                return false;
            }

            if (searchValue) {
                tmpModel = _.filter(model.get('originalData'), function (obj) {
                    if ( _.has(obj, 'label') ) {
                        return obj.label.toLowerCase().indexOf(searchValue) !== -1 ? obj : false;
                    }
                    return false;
                });

                model.set('data', tmpModel);
            } else {
                model.set('data', model.get('originalData'));
            }
        }

    });
