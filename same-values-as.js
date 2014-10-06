"use strict"
var global, exports;

function sortObject(a,b) {
    var sa = JSON.stringify(a);
    var sb = JSON.stringify(b);
    if (sa < sb) return -1;
    if (sa > sb) return 1;
    return 0;
}

function sameValuesAs (actual, expected) {
    if (actual === expected) return true;
    if (actual instanceof Date && expected instanceof Date) return actual.getTime() === expected.getTime();
    if (typeof actual != 'object' && typeof expected != 'object') return actual === expected;
    return objectSameValues(actual, expected);
}

function objectSameValues(a, b) {
    if (isUndefinedOrNull(a) && isUndefinedOrNull(b)) return true;
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;

    if (a.prototype !== b.prototype) return false;

    if (isArguments(a) !== isArguments(b)) return false;
    if (isArguments(a) && isArguments(b)) return sameValuesAs(pSlice.call(a), pSlice.call(b));

    if (isBuffer(a)) {
        if (!isBuffer(b)) return false;
        if (a.length !== b.length) return false;
        for (i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // We now either have an array or an object.
    // We want to match arrays regardless of order ('cos we're mad)
    
    var ka,kb;
    try {
        ka = Object.keys(a),
        kb = Object.keys(b);
    } catch (e) {//happens when one is a string literal and the other isn't
        return false;
    }

    var arrays = Array.isArray(a);
    if (arrays) {
        if (! Array.isArray(b)) return false;
        // sort both arrays for testing below
        a.sort(sortObject); // this is very expensive,
        b.sort(sortObject); // but does the trick for just about anything.
    }

    // test object or array deeply

    var allKeys = toUnique(ka.concat(kb));
    for (var i = allKeys.length - 1; i >= 0; i--) {
        var key = allKeys[i];
        if (isEmptyOrUndefined(a[key]) && isEmptyOrUndefined(b[key])) {
            // this is a weird special case for my own purposes.
            // An empty array on an object is considered the same as
            // a missing value, but not the same as null
        } else if (!sameValuesAs(a[key], b[key])) return false;
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
