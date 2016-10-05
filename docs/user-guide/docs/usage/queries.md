# Queries
Grasshopper's query builder accepts a query object that contains several parameters, some optional.

The returned object is an array with limit, skip and total. The total is the value of all content matched by query, not just returned objects.

Definitions for all possible query parameters/options

##filters
An array of optional filter objects for the query.

* key: The key of the content being filtered.
* cmp: The comparison operator for the filter value. Currently supported operators (Query accepts symbol or string value):
* '=': equals
* '!=' or 'not' or 'notequal' or 'notequals': not equal to
* '>=' or 'gte': greater than or equals
* '>' or 'gt': great  ser than
* '<=' or 'lte': less than or equals
* '<' or 'lt': less than
* 'in' or 'contains': contains
* '!in' or 'notin' or 'notcontains': does not contain
* '%' or 'like': like (Allows for 'fuzzy matching')
* '!%' or 'notlike': not like (Allows for 'fuzzy matching')
* 'between': between
* 'notbetween': not between
* 'size': size
* 'exists': exists

## value
Then value the filter will be compared with.

## types 
An optional array of content type ids.

## nodes 
An optional array of node ids.

## options 
Object. Possible key/value pairs are:

* limit : Limit number of results. String or number.
* skip : Skip specified number of results. String or number. (limit and skip support pagination)
* distinct : return distinct results within a find. Can include types.
* exclude : array of fields to be excluded from query.
* include : array of fields to be included in query.

##Important Notes

The options object can have include or exclude parameters, but not both in the same query.
When using 'options.distinct', filters can't be used. This means paging is not available.

## Examples

In the following examples, "request" is the configured grasshopper request object

1. Get a User with ID = {a valid ID}

```javascript
request
        .get()
        .users
        .query({
            filters: [
                {
                    key:'id',
                    cmp:'=',
                    value: {a valid ID}
                }
            ]
        })
```

2. Get a list of users with the first name "Bob" and were created after 01-01-2016

```javascript
 request
        .get()
        .users
        .query({
            filters: [
                 {
                     key:'firstname',
                     cmp:'=',
                     value: 'Bob'
                 },
                 {
                     key: 'dateCreated',
                     cmp: '>=',
                     value: new Date(2016,0,1,0,0,0,0)
                 }
             ]
        })
```

3. Get a list of content items with node id {NODE-ID} and sort by meta.created in descending order and limit returned results to 100
         
```javascript
 request
        .get()
        .content
        .query({
             nodes : [{NODE-ID}],
             options : {
                 sort : {'meta.created': -1},
                 limit : 100
             }
        })
```

4. Get a list of content items with node id {NODE-ID} with filters

```javascript
 request
        .get()
        .content
        .query({
            nodes: [{NODE-ID}],
            filters: [{
                key: 'contentField1',
                cmp: '=',
                value: ''
            }]
                })
```

5. Get all pieces of content within a content type

```javascript
request.get()
       .content
       .query({
           types : [constants.servicePageContentTypeId]
       });
```

6. Filter active blog posts, sort newest first, and paginate

```javascript
{
    types: [
        'blog-post-content-type-id'
    ],
    filters:[
        {
            key : 'fields.date',
            cmp : '<',
            value : new Date()
        }
    ],
    options: {
        limit: 4,
        skip: 8,
        sortBy: {
            'fields.date': -1
        }
    }
}
```

7. Optionally add year and category filters

```javascript
{
    key : 'fields.category',
    cmp : '=',
    value : 'business'
}
{
    key: 'fields.date',
    cmp: 'between',
    value: [
        new Date(2015, 0, 1, 0, 0, 0, 0),
        new Date(2015, 11, 31, 23, 59, 59, 999)
    ]
}
```

8. Find all events in the future that are not featured and are not assigned to any of my teams, sorted by start date ascending. Don’t include a bunch of the document fields in the response.

```javascript
app.ghCore.request(token.get()).content.query({
       nodes: ['551eb85bde9a59304b5164e0'],
       types: ['551eb735de9a59304b5164de'],
       filters: [
           { key: 'fields.dates.validTo', cmp: 'gte', value: new Date()},
           { key: 'fields.featured.value', cmp: 'eq', value: false},
           { key: 'fields.team', cmp: '!in', value: _.pluck(req.bridgetown.identity.profile.teams.concat(req.bridgetown.identity.profile.erns || []), 'id')}
       ],
       options: {
           skip: req.param('skip'),
           limit: req.param('limit'),
           sort: 'fields.dates.validFrom',
           exclude: [
               'fields.additioninformation',
               'fields.category',
               'fields.location',
               'fields.attendees',
               'fields.organizer',
               'fields.volunteeredhours',
               'fields.approved',
               'fields.eventfull',
               'fields.providetshirts',
               'fields.desiredvolunteers',
               'fields.isongoing',
               'fields.totalvolunteers'
           ],
       }
   });


```

9. Get list of users with first or last name, "Flober"

```
 request
        .get()
        .users
        .query({
            filters: [
                 {
                     key:['firstname', 'lastname'],
                     cmp:'=',
                     value: 'Flober'
                 }
             ]
        })
```

10. Get list of users with first name starting with Fa

```
 request
        .get()
        .users
        .query({
            filters: [
                 {
                     key:'firstname',
                     cmp:'%',
                     value: '^Fa'
                 }
             ]
        })
```        