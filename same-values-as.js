"use strict"
var global, exports;

function sortObject(a,b) {
    var sa = JSON.stringify(a).split('').sort().join('');
    var sb = JSON.stringify(b).split('').sort().join('');
    if (sa < sb) return -1;
    if (sa > sb) return 1;
    return 0;
}

function sameValuesAs (actual, expected) {
    return recurseObject(actual, expected, '');
}

function recurseObject(actual, expected, message) {
    if (actual === expected) return true;
    if (dateLike(actual) && (dateLike(expected) === dateLike(actual))) return true; // optimistic date comparison

    return objectSameValues(actual, expected, message);
}

function dateLike(val) {
    if (val instanceof Date) return val.getTime();
    var maybeDate = Date.parse(val);
    if (Number.isNaN(maybeDate)) return undefined;
    return maybeDate;
}

function objectSameValues(a, b, message) {

    if (message === '0') message = ''; 

    if (message !== '' && message !== undefined) {
        message = message + ' ';
    }

    if (isUndefinedOrNull(a) && isUndefinedOrNull(b)) return true;
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) throw new Error(message + 'Object instances do not match');

    if (a.prototype !== b.prototype) throw new Error(message + 'Object prototypes are not equal');

    if (isArguments(a) !== isArguments(b)) throw new Error(message + 'One of the objects is not a function');
    if (isArguments(a) && isArguments(b)) return recurseObject(pSlice.call(a), pSlice.call(b), message);

    if (isBuffer(a)) {
        if (!isBuffer(b)) throw new Error(message + 'One of the objects is not a buffer');
        if (a.length !== b.length) throw new Error(message + 'The buffer lengths do not match');
        for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) { 
                throw new Error(message + 'The buffer values do not match');
            }
        }
        return true;
    }

    // We now either have an array or an object.
    // We want to match arrays regardless of order ('cos we're mad)
    
    var ka,kb;
    try {
        ka = Object.keys(a),
        kb = Object.keys(b);
    } 
    catch (e) {

        //happens when one is a string literal and the other isn't
        // happens when two primitives don't match, ie. 1 and 2
        throw new Error(message + 'expected ' + '\''+ b + '\'' + ' does not match actual ' + '\'' + a + '\'');;
    }

    var arrays = Array.isArray(a);
    if (arrays) {
        if (! Array.isArray(b)) {
            throw new Error(message + ' One of the objects is not an array');
        }

        // sort both arrays for testing below
        a.sort(sortObject); // this is very expensive,
        b.sort(sortObject); // but does the trick for just about anything.
    }

    // test object or array deeply
    var allKeys = toUnique(ka.concat(kb));

    for (var i = allKeys.length - 1; i >= 0; i--) {
        var key = allKeys[i];
        message = key;

        if (isEmptyOrUndefined(a[key]) && isEmptyOrUndefined(b[key])) {

            // this is a weird special case for my own purposes.
            // An empty array on an object is considered the same as
            // a missing value, but not the same as null
        }
        else {

            if (arrays) {
                // If we have an array then the key is the position in the array
                message = "Array position " + message;
            }

            recurseObject(a[key], b[key], message)
        }
    }
    return true;
}

function toUnique(a){
    var c,b=a.length;
    if (b==0)return a;
    while(c=--b)while(c--)a[b]!==a[c]||a.splice(c,1);
    return a;
}

function isEmptyOrUndefined(value) {
    if (value === null) return false;
    return value === undefined || value.length === 0;
}

function isUndefinedOrNull(value) {
    return value === null || value === undefined;
}

function isBuffer (x) {
    if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
    if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
        return false;
    }
    if (x.length > 0 && typeof x[0] !== 'number') return false;
    return true;
}

function isArguments(x) {
	return typeof x === "object" && ( "callee" in x ) && typeof x.length === "number";
}

(function (provides) {
    provides.compare = sameValuesAs;
/* istanbul ignore next */ // `this` branch doesn't get followed
})(global || exports || this);

