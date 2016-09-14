content-type-keypath-select
    form
        select.form-select(style='width: 100%;')
            option Choose a keypath
            option(each='{ keypath in model.keyPaths }' value='{ keypath.value }') { keypath.label }
    script.
        this.model = {
            contentType : {},
            keyPaths : [],
            allContentTypes : window.contentTypes
        };
        
        this.on('update', function() {
            if(this.opts.contentType) {
                this.model.contentType = this.opts.contentType;
                
                this.model.keyPaths = this.generateKeyPaths(this.model.contentType);
            }
        });
        
        this.generateKeyPaths = function(contentType) {
            var keyPaths = [],
                allContentTypes = this.model.allContentTypes;
            
            function _addThisContentTypesKeypaths(parentLabel, parentPath, contentType) {
                contentType.fields.forEach(function(field) {
                    if(field.type === 'embeddedtype') {
                        _addThisContentTypesKeypaths(parentLabel + field.label, parentPath + field._id, allContentTypes.find(function(contentType) {
                            return contentType._id === field.options;
                        }));
                    } else {
                        keyPaths.push({
                            label : parentLabel ? parentLabel +'.'+ field.label : field.label,
                            value : parentPath ? parentPath +'.'+ field._id : field._id
                        });
                    }
                })
            }
            
            _addThisContentTypesKeypaths('', '', contentType);

            return keyPaths;
        };