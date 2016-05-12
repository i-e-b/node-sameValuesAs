node-sameValuesAs
=================

A very relaxed 'deep equals' that allows for any order in arrays, even if array values are objects.

This is a quick hack on https://www.npmjs.org/package/deep-equal and is probably full of bugs and strange
behaviours

Usage
-----

```javascript
    var compare = require("same-values-as").compare;

    compare(1, [1]);            // throws an exception telling you what the first difference is
    compare([1,2,3] , [3,2,1]); // returns true with no exception
```

Features
--------
* Considers `null` and `undefined` to be equal
* Compares the contents of arrays regardless of order (even if the children are objects)
* Throws an error if the objects don't match and tells you the first difference, with a path in the object.
* Tries to compare dates in a relaxed way (including where they are in strings or tick values)
* Considers a property with an empty array to equal a missing property

That last one should be explained:

```javascript
{
    "one": [2,3,4],
    "optional": []
}
```
is considered to be equal to
```javascript
{
    "one": [2,3,4]
}
```
but **not** equal to
```javascript
{
    "one": [2,3,4],
    "optional": null
}
```

