/*global define*/
define('plugins',["/admin/plugins/author/config.js","/admin/plugins/author/view.js","/admin/plugins/boolean/config.js","/admin/plugins/boolean/view.js","/admin/plugins/checkbox/config.js","/admin/plugins/checkbox/view.js","/admin/plugins/codeeditor/config.js","/admin/plugins/codeeditor/view.js","/admin/plugins/contentreference/config.js","/admin/plugins/contentreference/view.js","/admin/plugins/date/config.js","/admin/plugins/date/view.js","/admin/plugins/datetime/config.js","/admin/plugins/datetime/view.js","/admin/plugins/dropdown/config.js","/admin/plugins/dropdown/view.js","/admin/plugins/editorialwindow/config.js","/admin/plugins/editorialwindow/view.js","/admin/plugins/embeddedtype/config.js","/admin/plugins/embeddedtype/view.js","/admin/plugins/filereference/config.js","/admin/plugins/filereference/view.js","/admin/plugins/jsoneditor/config.js","/admin/plugins/jsoneditor/view.js","/admin/plugins/keyvalue/config.js","/admin/plugins/keyvalue/view.js","/admin/plugins/number/config.js","/admin/plugins/number/view.js","/admin/plugins/password/config.js","/admin/plugins/password/view.js","/admin/plugins/radio/config.js","/admin/plugins/radio/view.js","/admin/plugins/readonly/config.js","/admin/plugins/readonly/view.js","/admin/plugins/richtext/config.js","/admin/plugins/richtext/view.js","/admin/plugins/slug/config.js","/admin/plugins/slug/view.js","/admin/plugins/template/config.js","/admin/plugins/template/view.js","/admin/plugins/textarea/config.js","/admin/plugins/textarea/view.js","/admin/plugins/textbox/config.js","/admin/plugins/textbox/view.js"],
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