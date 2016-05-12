var expect = require('chai').expect;
var fs = require('fs');

var cmp = require("../same-values-as.js").compare;

describe("Specific use cases", function() {
    it("should find similar JSON files to be equal", function(){
        var left = JSON.parse(fs.readFileSync('./test/cmpA.json').toString());
        var right = JSON.parse(fs.readFileSync('./test/cmpB.json').toString());

        expect(cmp(left,right)).to.be.true;
    });
    it("should give a path to differences in objects", function(){
        var left = JSON.parse(fs.readFileSync('./test/cmpA.json').toString());
        var right = JSON.parse(fs.readFileSync('./test/cmpC.json').toString());
        var msg = '!! NO ERROR THROWN !!';

        try {
            cmp(left,right);
        } catch (e) {
            msg = ''+e;
        }

        expect(msg).to.equal('Error: <root>.OrderItem[0].ChildOrderItem.Product.EntityID.ID.RateAttribute[0] Primitive values are not equal');
    });

});

