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

2. Get a list of users with the first name "Bob" and were created after 01-01-2016

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

3. Get a list of content items with node id {NODE-ID} and sort by meta.created in descending order and limit returned results to 100
         
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

4. Get a list of content items with node id {NODE-ID} with filters

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
