/*global define*/
define(["plugins/author/config.js","plugins/author/view.js","plugins/boolean/config.js","plugins/boolean/view.js","plugins/checkbox/config.js","plugins/checkbox/view.js","plugins/codeeditor/config.js","plugins/codeeditor/view.js","plugins/contentreference/config.js","plugins/contentreference/view.js","plugins/date/config.js","plugins/date/view.js","plugins/datetime/config.js","plugins/datetime/view.js","plugins/dropdown/config.js","plugins/dropdown/view.js","plugins/editorialwindow/config.js","plugins/editorialwindow/view.js","plugins/embeddedtype/config.js","plugins/embeddedtype/view.js","plugins/filereference/config.js","plugins/filereference/view.js","plugins/jsoneditor/config.js","plugins/jsoneditor/view.js","plugins/keyvalue/config.js","plugins/keyvalue/view.js","plugins/number/config.js","plugins/number/view.js","plugins/password/config.js","plugins/password/view.js","plugins/radio/config.js","plugins/radio/view.js","plugins/readonly/config.js","plugins/readonly/view.js","plugins/richtext/config.js","plugins/richtext/view.js","plugins/slug/config.js","plugins/slug/view.js","plugins/template/config.js","plugins/template/view.js","plugins/textarea/config.js","plugins/textarea/view.js","plugins/textbox/config.js","plugins/textbox/view.js"],
    function(authorConfig,authorView,booleanConfig,booleanView,checkboxConfig,checkboxView,codeeditorConfig,codeeditorView,contentreferenceConfig,contentreferenceView,dateConfig,dateView,datetimeConfig,datetimeView,dropdownConfig,dropdownView,editorialwindowConfig,editorialwindowView,embeddedtypeConfig,embeddedtypeView,filereferenceConfig,filereferenceView,jsoneditorConfig,jsoneditorView,keyvalueConfig,keyvalueView,numberConfig,numberView,passwordConfig,passwordView,radioConfig,radioView,readonlyConfig,readonlyView,richtextConfig,richtextView,slugConfig,slugView,templateConfig,templateView,textareaConfig,textareaView,textboxConfig,textboxView) {
        return {
            fields : [
				{
					type: "author", 
					id: 1, 
					config: authorConfig, 
					helpText: "Author Help Text", 
					name: "Author", 
					view: authorView
				},
				{
					type: "boolean", 
					id: 2, 
					config: booleanConfig, 
					helpText: "boolean Help Text", 
					name: "Boolean", 
					view: booleanView
				},
				{
					type: "checkbox", 
					id: 3, 
					config: checkboxConfig, 
					helpText: "Checkbox Help Text", 
					name: "Checkbox", 
					view: checkboxView
				},
				{
					type: "codeeditor", 
					id: 4, 
					config: codeeditorConfig, 
					helpText: "Code Editor Help Text", 
					name: "Code Editor", 
					view: codeeditorView
				},
				{
					type: "contentreference", 
					id: 5, 
					config: contentreferenceConfig, 
					helpText: "Content Reference Help Text", 
					name: "Content Reference", 
					view: contentreferenceView
				},
				{
					type: "date", 
					id: 6, 
					config: dateConfig, 
					helpText: "Date Help Text", 
					name: "Date", 
					view: dateView
				},
				{
					type: "datetime", 
					id: 7, 
					config: datetimeConfig, 
					helpText: "DateTime Help Text", 
					name: "Date Time", 
					view: datetimeView
				},
				{
					type: "dropdown", 
					id: 8, 
					config: dropdownConfig, 
					helpText: "Dropdown Help Text", 
					name: "Dropdown", 
					view: dropdownView
				},
				{
					type: "editorialwindow", 
					id: 9, 
					config: editorialwindowConfig, 
					helpText: "Editorial Window Help Text", 
					name: "Editorial Window", 
					view: editorialwindowView
				},
				{
					type: "embeddedtype", 
					id: 10, 
					config: embeddedtypeConfig, 
					helpText: "embedded type Help Text", 
					name: "Embedded Type", 
					view: embeddedtypeView
				},
				{
					type: "filereference", 
					id: 11, 
					config: filereferenceConfig, 
					helpText: "File Reference Help Text", 
					name: "File Reference", 
					view: filereferenceView
				},
				{
					type: "jsoneditor", 
					id: 12, 
					config: jsoneditorConfig, 
					helpText: "JSON Editor Help Text", 
					name: "JSON Editor", 
					view: jsoneditorView
				},
				{
					type: "keyvalue", 
					id: 13, 
					config: keyvalueConfig, 
					helpText: "keyvalue Help Text", 
					name: "Key : Value", 
					view: keyvalueView
				},
				{
					type: "number", 
					id: 14, 
					config: numberConfig, 
					helpText: "number Help Text", 
					name: "Number", 
					view: numberView
				},
				{
					type: "password", 
					id: 15, 
					config: passwordConfig, 
					helpText: "password Help Text", 
					name: "Password", 
					view: passwordView
				},
				{
					type: "radio", 
					id: 16, 
					config: radioConfig, 
					helpText: "radio Help Text", 
					name: "Radio", 
					view: radioView
				},
				{
					type: "readonly", 
					id: 17, 
					config: readonlyConfig, 
					helpText: "Readonly Help Text", 
					name: "Readonly", 
					view: readonlyView
				},
				{
					type: "richtext", 
					id: 18, 
					config: richtextConfig, 
					helpText: "Rich Text Help Text", 
					name: "Rich Text", 
					view: richtextView
				},
				{
					type: "slug", 
					id: 19, 
					config: slugConfig, 
					helpText: "Slug Help Text", 
					name: "Slug", 
					view: slugView
				},
				{
					type: "template", 
					id: 20, 
					config: templateConfig, 
					helpText: "Template Help Text", 
					name: "Template", 
					view: templateView
				},
				{
					type: "textarea", 
					id: 21, 
					config: textareaConfig, 
					helpText: "TextArea Help Text", 
					name: "TextArea", 
					view: textareaView
				},
				{
					type: "textbox", 
					id: 22, 
					config: textboxConfig, 
					helpText: "TextBox Help Text", 
					name: "TextBox", 
					view: textboxView
				}
            ]
        };
    });
