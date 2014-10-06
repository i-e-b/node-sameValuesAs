var expect = require('chai').expect;

var cmp = require("../sameValuesAs.js").compare;

describe("Comparing values", function() {
    it("should consider identical values as equal", function(){
        expect(cmp(1,1)).to.be.true;
        expect(cmp([1],[1])).to.be.true;
        expect(cmp([],[])).to.be.true;
        expect(cmp({},{})).to.be.true;
        expect(cmp("hello","hello")).to.be.true;
        expect(cmp({"hello":"world"},{"hello":"world"})).to.be.true;
    });

    it("should consider different values as not equal", function(){
        expect(cmp(1,2)).to.be.false;
        expect(cmp([],[1])).to.be.false;
        expect(cmp([],null)).to.be.false;
        expect(cmp({},{"1":1})).to.be.false;
        expect(cmp("hello","world")).to.be.false;
        expect(cmp({"hello":"world"},{"goodbye":"world"})).to.be.false;
    });

    it("should consider null and undefined as equivalent and equal", function(){
        expect(cmp(null, null)).to.be.true;
        expect(cmp(undefined, undefined)).to.be.true;
        expect(cmp(null, undefined)).to.be.true;
        expect(cmp(undefined, null)).to.be.true;
    });

    it("should consider null or undefined to no equal empty objects and arrays", function(){
        expect(cmp(null,[])).to.be.false;
        expect(cmp(undefined, [])).to.be.false;
        expect(cmp(null, {})).to.be.false;
        expect(cmp(undefined,{})).to.be.false;
    });

    it("should consider arrays to be equal if they contain the same values, regardless of order",function(){
        expect(cmp(
                [1,2,3,4,5],
                [5,3,1,4,2]
                )).to.be.true;
        expect(cmp(
                [3,4,5],
                [5,3,1,4,2]
                )).to.be.false;
        expect(cmp(
                [1,2,3,4,5],
                [1,4,2]
                )).to.be.false;
    });

    it("should consider arrays of objects equal if they contain matching children, regardless of order",function(){
        expect(cmp(
                [{"a":{"b":"c","d":"e"}, "x":['y','z']}],
                [{"x":['z','y'], "a":{"d":"e","b":"c"}}]
                )).to.be.true;
        expect(cmp(
                [{"a":{"b":"XXX","d":"e"}, "x":['y','XXX']}],
                [{"x":['z','y'], "a":{"d":"e","b":"c"}}]
                )).to.be.false;
    });

    it("doesn't compare functions",function(){
        expect(cmp(
                {"a":function(a,b){}},
                {"a":function(a,b){}}
                )).to.be.false;
    });

    // this one is specifically for testing input/output wire formats
    it("should consider empty arrays and missing keys to be equal",function(){
        expect(cmp(
                {"a":[]},
                {}
                )).to.be.true;
    });
});

