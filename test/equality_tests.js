var expect = require('chai').expect;

var cmp = require("../same-values-as.js").compare;

describe("Comparing values", function() {
    it("should consider identical values as equal", function() {
        AreEqual(function(){cmp(1,1)}, "numbers");
        AreEqual(function(){cmp([1],[1])}, "arrays");
        AreEqual(function(){cmp([],[])}, "empty arrays");
        AreEqual(function(){cmp({},{})}, "empty objects");
        AreEqual(function(){cmp("hello","hello")}, "strings");
        AreEqual(function(){cmp({"hello":"world"},{"hello":"world"})}, "objects");
    });

    it("should consider different values as not equal", function(){
        AreNotEqual(function() { cmp(1,2); }, "numbers");
        AreNotEqual(function() { cmp([],[1]); }, "arrays");
        AreNotEqual(function() { cmp([],null); }, "array and null");
        AreNotEqual(function() { cmp({},{"1":1}); }, "objects");
        AreNotEqual(function() { cmp("hello","world"); }, "strings");
        AreNotEqual(function() { cmp({"hello":"world"},{"goodbye":"world"}); }, "objects 2");
    });

    it("should treat date like strings as equal", function(){
        expect(cmp("Mon Oct 06 2014","Mon Oct 06 2014 00:00:00")).to.be.true;
    });

    it("should consider null and undefined as equivalent and equal", function(){
        expect(cmp(null, null)).to.be.true;
        expect(cmp(undefined, undefined)).to.be.true;
        expect(cmp(null, undefined)).to.be.true;
        expect(cmp(undefined, null)).to.be.true;
    });

    it("should consider null or undefined to no equal empty objects and arrays", function(){

        AreNotEqual(function() { cmp(null,[]); });
        AreNotEqual(function() { cmp(undefined, []); });
        AreNotEqual(function() { cmp(null, {}); });
        AreNotEqual(function() { cmp(undefined,{}); });
    });

    it("should consider arrays to be equal if they contain the same values, regardless of order",function(){
        expect(cmp(
                [1,2,3,4,5],
                [5,3,1,4,2]
                )).to.be.true;

        AreNotEqual(function() { cmp([3,4,5], [5,3,1,4,2]); });
        AreNotEqual(function() { cmp([1,2,3,4,5], [1,4,2]); });
    });

    it("should consider arrays of objects equal if they contain matching children, regardless of order",function(){
        expect(cmp(
                [{"a":{"b":"c","d":"e"}, "x":['y','z']}],
                [{"x":['z','y'], "a":{"d":"e","b":"c"}}]
                )).to.be.true;

        AreNotEqual(function(){
            cmp([{"a":{"b":"XXX","d":"e"}, "x":['y','XXX']}],
                [{"x":['z','y'], "a":{"d":"e","b":"c"}}]);
        });
    });

    it("doesn't compare functions",function(){

        AreNotEqual(function()
        {
            cmp({"a":function(a,b){}}, {"a":function(a,b){}});
        });
    });

    // this one is specifically for testing input/output wire formats
    it("should consider empty arrays and missing keys to be equal",function(){
        expect(cmp(
                {"a":[]},
                {}
                )).to.be.true;
    });
});

/**
* Executes a comparison and asserts that an exception was thrown
*/
function AreNotEqual(action, msg)
{
    var exceptionThrown = false;

    try
    {
        action();
    }
    catch (err)
    {
        exceptionThrown = true;
    }

    if (! exceptionThrown) console.log(msg);
    expect(exceptionThrown).to.be.true;
}

function AreEqual(action, msg) {
    var exceptionThrown = false;

    try
    {
        action();
    }
    catch (err)
    {
        console.log(err);
        exceptionThrown = true;
    }

    if (exceptionThrown) console.log(msg);
    expect(exceptionThrown).to.be.false;
}

