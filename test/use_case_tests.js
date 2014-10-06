var expect = require('chai').expect;
var fs = require('fs');

var cmp = require("../same-values-as.js").compare;

describe("Specific use cases", function() {
    it("should JSON files to be equal", function(){
        var left = JSON.parse(fs.readFileSync('./test/cmpA.json').toString());
        var right = JSON.parse(fs.readFileSync('./test/cmpB.json').toString());

        expect(cmp(left,right)).to.be.true;
    });
});

