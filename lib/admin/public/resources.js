/*global define*/
define({
    api : {
        base : {
            errors : {
                400 : 'Bad Request',
                401 : 'Unauthorized',
                403 : 'Forbidden',
                404 : 'Not Found',
                405 : 'Method Not Allowed',
                408 : 'Request Timeout',
                500 : 'Server Error',
                503 : 'Service Unavailable'
            }
        },
        login : {
            errors : {
                400 : 'Bad Request',
                401 : 'Incorrect Username Or Password',
                403 : 'Forbidden',
                404 : 'Not Found',
                405 : 'Method Not Allowed',
                408 : 'Request Timeout',
                500 : 'Server Error',
                503 : 'Service Unavailable'
            }
        }
    },
    user : {
        dontHaveAccount : 'Don\'t have an account?',
        loggedInAs : 'Logged in as',
        signIn : 'Sign In',
        signInRegisteredUser : 'Sign in using your registered account:',
        signUp : 'Sign Up',
        userDetailHeaderText : 'Profile for: ',
        unlinkModalWithBasic : {
            header: 'Unlink Google',
            msg: 'Are you sure you want to remove google log in?'
        },
        unlinkModalWithoutBasic : {
            header: 'Unlink Google',
            msg: 'You are about to unlink this Google account without a username and password. Clicking continue will disable this user account.'
        },
        unlinkSuccessModal : {
            header: 'Unlink Success',
            msg: 'You successfully unlinked your google account.',
            hideCancel: true
        },
        linkModal : {
            header: 'Link Google',
            msg: 'Are you sure you want to link your google account?'
        },
        linkModalSuccess : {
            header: 'Link Success',
            msg: 'You successfully linked your google account.',
            hideCancel: true
        },
        delete : {
            warningMessage : 'Are you sure you want to delete this user?',
            success : 'User Successfully Deleted',
            failure : 'Failed to delete user.'
        },
        attributeTitles : {
            name : 'USER NAME:',
            firstName : 'FIRST NAME',
            lastName : 'LAST NAME',
            displayname : 'DISPLAY NAME',
            role : 'USER ROLE',
            enabled : 'ENABLED?',
            email : 'EMAIL',
            username : 'USERNAME',
            password : 'PASSWORD',
            createdby : 'CREATED BY',
            updatedby : 'UPDATED BY',
            profile : 'PROFILE',
            linkedidentities : 'LINKED IDENTITIES'
        },
        selfLockWarning:'You are about to disable yourself and lose access to the system. ' +
            'Are you sure you want to do this? (You Will still need to save to apply changes.',
        roles : [
            'admin',
            'editor',
            'reader',
            'external',
            'none'
        ],
        successfullyUpdated : 'User was successfully updated',
        updateError : 'User was successfully updated',
        errors : {
            403 : 'You do not have adequate permissions to view/edit this profile.'
        },
        newUserAdded : 'New User Added',
        couldNotFindUserContentType : 'Could not find Users content type. Please make one.',
        addNewUser : 'Add New User',
        blocks: {
            lockUser: 'Lock this user',
            unlockUser : 'This user is currently locked.',
            lockUserSubtext: 'Locking a user will prevent them from logging in and using the system.',
            lockUserButton: 'Lock user',
            unlockUserButton: 'Unlock user',
            deleteUser: 'Remove user',
            deleteUserSubtext: 'Deleting a user will permanently remove them from the system. This operation cannot be undone.',
            deleteUserButton: 'Remove user'
        }
    },
    site : {
        about : 'About Grasshopper'
    },
    mastheadButtons : {
        createContent : 'Create Content',
        uploadFile : 'Upload File',
        createFolder : 'Create Folder',
        actions : 'Actions',
        addNewUser : 'Add New User',
        addContentType : 'New Content Type',
        editNodeName : 'Edit Name',
        editNodeContentTypes : 'Edit Content Types',
        deleteNode : 'Delete',
        exportAsCsv : 'Export To Csv'
    },
    node : {
        deletionWarning : 'Are you sure you want to delete this folder? All of its contents will also be deleted.',
        userDeletionWarning : 'Are you sure that you want to delete this user?',
        successfullyDeletedWithoutLabel : 'Successfully deleted',
        successfullyDeleted : 'Item :item was successfully deleted.',
        successfullyUpdated : 'Folder was successfully updated.',
        errorUpdated : 'Folder could not be updated.',
        errorDeleted : 'There was an issue deleting this folder: ',
        enterName : 'Please enter the name of the folder: ',
        errorCreating : 'Folder could not be added.',
        editName : 'Edit folder name',
        emptyNode : 'This folder does not contain any folders.',
        emptyContent : 'This folder does not contain any content.',
        clickToAdd : 'Click to add some.'
    },
    contentItem : {
        deletionWarning : 'Are you sure you want to delete this content?',
        successfullyDeleted : 'Content :item was successfully deleted.',
        errorDeleted : 'There was an issue deleting this content: ',
        readonly : 'Readonly',
        labelErrorMessage : 'Label is a required field.',
        successfullySaved : 'Content successfully saved.',
        failedToSave : 'Content could not be saved.',
        failedToFetch : 'Content could not be retrieved.',
        failedToFetchContentsContentType : 'Could not retrieve content type for this content.',
        label : 'Label',
        labelRequiredMessage : 'Label is a required field.',
        author : 'Author',
        slug : 'Slug',
        status : 'Status',
        parent : 'Parent Folder',
        id : 'Content Id',
        type : 'Content Type'
    },
    contentType : {
        addContentTypes : 'Add Content Types: ',
        editContentTypes : 'Edit allowed Content Types',
        contentTypeAdded : 'Content Type Added',
        deletionWarningWithoutAssociatedContent : 'Are you sure you want to delete this content type?',
        deletionWarningWithAssociatedContent : 'You have :count of content associated with this content type. ' +
            'If you confirm it will all be deleted!',
        successfullyDeleted : 'Content Type :item was successfully deleted.',
        errorDeleted : 'There was an issue deleting this content type: ',
        serverError : 'Content Types could not be retrieved.',
        selectContentType : 'Which Content Type would you like to use?',
        contentInRoot : 'You cannot create content in the Root.',
        noContentTypes : 'This folder has no allowed content types.',
        noContentTypesCreated: 'There are currently no content types.',
        fields : 'Fields',
        fieldType : 'Field Type',
        addNewField : 'Add New Field',
        successfulSave : 'Content type successfully saved.',
        failedSave : 'Content type could not be saved.',
        removeFieldWarning: 'If you delete this field it will be deleted from all content of this type.',
        addOption : 'Add Option',
        helpText : 'Help Text',
        description: 'Description',
        emptyFields : 'Click "Add new field" to add your first field.',
        switchingBetweenSimpleAndComplexTypesWarning : 'You are switching between simple and complex data types. ' +
            'If you confirm, your content may be corrupted!',
        selectOption : 'Please Select',
        thisFieldHasNoValidation : 'This field has no validations',
        addValidationType : 'Add Validation',
        validation : {
            mustHaveLabel : 'Content type must have a title.',
            fieldsMustHaveLabel : 'All fields must have a name.',
            fieldsMustHaveIds: 'All fields should have ids',
            fieldsMustBeUnique: 'All fields ids should be unique',
            firstFieldIsNotAStringWarning : 'The first field in this content type is not a string. ' +
                'This could cause weird behavior in your content labels.'
        }
    },
    asset : {
        deletionWarning : 'Are you sure you want to delete this asset?',
        successfullyDeleted : 'Asset Name: :asset was successfully deleted.',
        errorDeleted : 'There was an issue deleting this asset: ',
        editFileName : 'Edit File Name',
        editNameSuccess : 'File name was successfully updated.',
        editNameFail : 'File name could not be updated.',
        uploadAssetError : 'Upload Failed',
        dragFilesHere : 'Drag and Drop Files Here. Or Click to Select.',
        uploadInRoot : 'You cannot upload assets in the Root.',
        uploadAssetModalMsg : 'Upload an Asset.',
        emptyNode : 'This folder does not contain any files.',
        clickToAdd : 'Click to add some.'
    },
    clipboard:{
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        clear : 'Clear Clipboard',
        warningPaste: 'You are about to :op :nr_items :items to the :folder folder',
        differentContentTypesWarning: 'Clipboard contains items of different types ',
        noOperationSpecified: 'No operation specified',
        cannotCompleteOperation: 'Cannot complete operation',
        itemsInClipboard: 'item in clipboard',
        toClipboard : 'to clipboard',
        copied : 'Copied'
    },
    contentBrowse : {
        author : 'Author',
        modified : 'Modified',
        archived : 'Archived'
    },
    fileIndex : {
        files : 'Files',
        fileName : 'File Name',
        size : 'Size',
        modified : 'Modified'
    },
    pluginWrapper : {
        emptyFieldsMessage : 'not set.',
        clickToAdd : 'Click To Add.'
    },
    plugins : {
        author : {
            selectUser : 'Select User',
            noPermissions : 'You don\'t have permissions to query users list. You can only select current user.'
        },
        codeEditor : {
            language : 'Language',
            theme : 'Theme',
            loading : 'LOADING CODE EDITOR...'
        },
        contentReference : {
            allowedContentTypes: 'Allowed Content Types',
            selectedContent : 'Selected Content',
            currentFolder : 'Current Folder',
            selectDefaultFolder : 'Select Default Folder',
            defaultFolder : 'Default Folder',
            contentTypes : 'Content Types',
            selectContent : 'Select Content',
            viewContent : 'View Content'
        },
        dropdown : {
            selectOption : 'Please Select'
        },
        editorialWindow : {
            loading : 'Loading editorial window...',
            startAfterEnd : 'Start date is after end date',
            setToNow : 'Set to now',
            start : 'Start',
            end : 'End',
            neverExpire : 'Never Expire',
            dateFormat: 'YYYY/MM/DD h:mm a'
        },
        embeddedType : {
            contentType : 'Content Type',
            validation : {
                content : {

                },
                setup : {
                    nooptions : 'Missing embedded type options. Please select a content type to embed from the dropdown.'
                }
            }
        },
        fileReference : {
            selectedFile : 'Selected File',
            currentFolder : 'Current Folder',
            selectDefaultFolderOr : 'Select Default Folder or',
            setRootAsDefault : 'Set Root Folder as Default',
            defaultFolder : 'Default Folder',
            contentTypes : 'Content Types',
            selectFile : 'Select File',
            viewSelectedFile : 'View Selected File'
        },
        richText : {
            selectFile : 'Select File',
            loading : 'LOADING RICH TEXT...'
        },
        slug : {
            refresh : 'Refresh',
            selectField : 'Select Field'
        },
        template : {
            enterTemplateString : 'Template String',
            /* jshint ignore:start */
            templateInterpolation : 'Use [[= document.field ]] syntax.  The fields available to template are the fields from the content. They are accesible on the `document` object. If you are used to doing "fields.title", in this template you would just use "document.title". If you want to access the top level parent document, you would use [[= parentDocument.title ]].'
            /* jshint ignore:end */
        },
        jsonEditor : {
            language : 'Language',
            theme : 'Theme',
            loading : 'LOADING JSON EDITOR...'
        }
    },
    validationViews : {
        deletionWarning : 'You are about to delete a validation field. Are you sure you want to do this?'
    },
    // General Text (reusable) - try to keep it alphabetized
    actions : 'Actions',
    advancedSearch : 'Advanced Search',
    add : 'Add',
    addNewUser : 'Add New User',
    addFilter : 'Add Filter',
    allowMultiple : 'Allow Multiple',
    showMultipleSettings : 'Show Multiple Settings',
    allowMultipleSettings : 'Allow Multiple Settings',
    cancel : 'Cancel',
    close : 'Close',
    comparator : 'Comparator',
    confirm : 'Confirm',
    content : 'Content',
    contentTypes : 'Content Types',
    forbidden : 'Forbidden',
    notFound : 'Not Found',
    currentlySignedIn : 'You are currently signed in.',
    dashboard : 'Dashboard',
    defaultValue : 'Default Value',
    download : 'Download',
    edit : 'Edit',
    email : 'Email',
    enabled : 'Enabled',
    error : 'Error',
    emptySearchResult : 'Ooops, try one more time.',
    falseText : 'False',
    from : 'From',
    filters : 'Filters',
    help : 'Help',
    helpText : 'Help Text',
    id : 'ID',
    key: 'Key',
    label : 'Label',
    login : 'Login',
    displayname : 'Display Name',
    log_in : 'Log In',
    logInWithGoogle : 'Login with Google',
    log_out : 'Log Out',
    match : 'Match',
    maximum : 'Maximum',
    max : 'Max',
    menu : 'Menu',
    minimum : 'Minimum',
    min : 'Min',
    multiple : 'Multiple',
    name : 'Name',
    next : 'Next',
    newWord : 'New',
    no : 'No',
    nodes : 'Nodes',
    ok : 'Ok',
    options : 'Options',
    open : 'Open',
    password : 'Password',
    previous : 'Previous',
    profile : 'Profile',
    remind : 'Remind',
    remove : 'Remove',
    reset : 'Reset',
    retry : 'Retry',
    required : 'Required',
    role : 'Role',
    root : 'Root',
    save : 'Save',
    saveAndClose : 'Save and Close',
    selectOption : 'Please Select',
    select : 'Select',
    selectAll : 'Select All',
    settings : 'Settings',
    siteName : 'Grasshopper',
    status : 'Status',
    success : 'Success',
    summary : 'Summary',
    thisIsNotImplemented : 'This is not yet implemented.',
    title : 'Title',
    to : 'To',
    trueText : 'True',
    type : 'Type',
    types : 'Types',
    upload : 'Upload',
    uploadFile : 'Upload File',
    user_name : 'User Name',
    users : 'Users',
    info : 'Info',
    value : 'Value',
    validation : 'Validation',
    warning : 'Warning!',
    welcomeBack : 'Welcome Back',
    where : 'Where',
    yes : 'Yes'
});
