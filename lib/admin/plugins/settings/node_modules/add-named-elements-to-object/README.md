# Add Named Elements To Object.

So, I was using Riot.js for a while and my favorite feature was that any 'named' elements within your view would be accessible on the view scope by name.  This eliminated ALL DOM traversal in my project. As any element that I needed a handle on for any reason, I could just name the element then it would be available to me by reference.

For example, if you had this in your template for a view:
```html
<div name='ramaSlamaDingDong'> ... really important stuff </div>
```

Because you used the 'name' attribute, this element is now automatically accessible in your view as `this.ramaSlamaDingDong`. No dom traversal necessary.

I loved this feature, and wanted to use it on other projects. So. I wrote this one.

### How to use it.

This lib exports a single method that takes 2 arguments: the object you want to add the named elements to, and the root DOM node you want to traverse.

Something Like:
```javascript
var addNamedElementsToObject = require('add-named-elements-to-object');

// After your view template is available, but Ideally before you put it in the DOM because we will be recursing it. Though, it will work fine if the document fragment is already in the DOM.

addNamedElementsToObject(this.elements, this.rootTemplate);

// Any named elements in the rootTemplate will be available by reference on this.elements;

```

### What if there are many with the same name?

So you want a handle on a bunch of elements, like a list of grid items, and you want to manipulate them all. This lib will stack them into a normal array accessible by name. (not a NODE LIST, so all array methods are available.)

For example,
```html
<ul>
    <li name='listItem'></li>
    <li name='listItem'></li>
    <li name='listItem'></li>
    <li name='listItem'></li>
    <li name='listItem'></li>
    <li name='listItem'></li>
    <li name='listItem'></li>
</ul>
```

Then in your view,
```javascript
this.listItem.forEach(function() {});

// or

this.listItem.map(); // ...etc etc
```

