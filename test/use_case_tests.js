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

        expect(msg).to.equal('Error: <root>.OrderItem[0].Product.RateAttribute Array lengths are different (0 vs 1)');
    });
    it("should handle minor changes in arrays of objects", function() {
        var msg = '!! NO ERROR THROWN !!';

        var left = [
            {
                id: 'test1',
                title: 'test attachment 1',
                url: 'www.sigma-systems.com/test/doc1',
                source: 0,
                quoteId: 'a4073b3e-60d5-4ba0-a8df-47cd0f437114'
            },
            {
                id: 'test2',
                title: 'test attachment 2',
                url: 'www.sigma-systems.com/test/doc2',
                source: 0,
                quoteId: 'a4073b3e-60d5-4ba0-a8df-47cd0f437114'
            }
        ];
        var right = [
            {
                id: 'test3',
                title: 'test attachment 1',
                url: 'www.sigma-systems.com/test/doc1',
                source: 0,
                quoteId: 'a4073b3e-60d5-4ba0-a8df-47cd0f437114'
            },
            {
                id: 'test2',
                title: 'test attachment 2',
                url: 'www.sigma-systems.com/test/doc2',
                source: 0,
                quoteId: 'a4073b3e-60d5-4ba0-a8df-47cd0f437114'
            }
        ];

        try {
            cmp(left,right);
        } catch (e) {
            msg = ''+e;
        }

        expect(msg).to.equal('Error: <root>[0].id Primitive values are not equal');

    });
});

