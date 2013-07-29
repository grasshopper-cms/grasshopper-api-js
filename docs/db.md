# Database Schema

By nature this system requires a no-sql database to be most affective. That being said you could implement it in other
ways but we would strongly encourage a document database to perform best.

## Users

The users collection is used to determine access to the system and permissions to specific content.

    {
        _id: pk,
        name: "",
        password: "", //This should be hashed using the standard solid best practices
        email: "",
        role: "", // [editor, author, reader, admin, none]
        permissions: [{
            nodeid: "",
            role: "", //same as above
        }],
        ...
    }

Since this is a no-sql schema, we can add as many properties to a user as we want, including profile thumbnail, social
login info, etc.


## Content Types

Content types defines the form interface that we are going to show a user when they are creating or editing content.
Content types are basically a collection of rules for accepting new content.

    {
        _id: pk,
        label: "",
        description: "",
        helpText: "",
        fields: [{
            label: "",
            type: "", // Types of fields [readonly, single line textbox, multi-line textbox, rich textbox, dropdown list, reference to content, reference to file, code editor, checkox, Datetime]
            instancing: 1, // How many to show
            options: [{ //Anything necessary to render the form control correct (select options for drop downs etc).

            }],
            required: true/false
        }],
        meta: [{ // Same as fields but visible in another part of the UI
            label: "",
            type: "", // Types of fields
            instancing: 1, // How many to show
            options: [{

            }],
            required: true/false
        }]
    }

## Nodes

Nodes are like directories on a hard drive. They group content based off of a location. Any node is allowed to have any type of content that has been specified.

    {
        _id: pk,
        label: "",
        slug: "",
        parentId: "",
        allowedTypes: [""], //array of type ids
        meta: [{
            name: "",
            value: "",
        }],
        subNodes: [{
            id: fk,
            slug: "",
            label: ""
        }]
    }

## Content Objects

So we have users, then content types, then places to put our content, the last thing left is creating content. Content is placed inside of nodes based off of the "allowedTypes" parameter.

    {
        _id: pk,
        type: fk, //Relationship to content type
        label: "",
        environments: [""], //Array of available environments, you could use this for migrations
        language: "",
        status: "",
        pendingChanges: blob, //Any changes that have not been committed (differences like a git diff)
        node: {
            id: "",
            slug: "",
            displayOrder: ""
        },
        dateCreated: "",
        dateModified: "",
        lastModifiedBy: "",
        validTo: "",
        validFrom: "",
        content: [{
            key: "",
            value: ""
        }],
        meta: [{
            key: "",
            value: ""
        }]
    }