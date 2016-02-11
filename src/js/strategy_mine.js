/**
 * The objects participating in this pattern are:
 *      Context -- In sample code: Shipping
 *                  maintains a reference to the current Strategy object
 *                  supports interface to allow clients to request Strategy calculations
 *                  allows clients to change Strategy
 *      Strategy -- In sample code: UPS, USPS, Fedex
 *                  implements the algorithm using the Strategy interface
 *
 */
(function () {
    'use strict';

    // FACTORY FOR CONTEXT OBJECTS
    function createShipping() {
        var proto = {},
            shipping;
        proto.setStrategy = function(company) {
            this.company = company;
        };
        proto.calculate = function(thePackage) {
            var cost;
            if (!this.company) {
                cost = "Can't calculate without a company defined";
            } else {
                cost = this.company.calculate(thePackage);
            }
            return cost;
        };
        shipping = Object.create(proto);
        shipping.company = undefined;
        return shipping;
    }

    // STRATEGIES
    var UPS = function() {
        this.calculate = function(thePackage) {
            // calculations...
            return "$45.95";
        }
    };

    var USPS = function() {
        this.calculate = function(thePackage) {
            // calculations...
            return "$39.40";
        }
    };

    var Fedex = function() {
        this.calculate = function(thePackage) {
            // calculations...
            return "$43.20";
        }
    };

    function run() {
        var thePackage = { from: "76712", to: "10012", weigth: "lkg" };

        // the 3 strategies

        var ups = new UPS();
        var usps = new USPS();
        var fedex = new Fedex();

        var shipping = createShipping();

        shipping.setStrategy(ups);
        console.log("UPS Strategy: " + shipping.calculate(thePackage));
        shipping.setStrategy(usps);
        console.log("USPS Strategy: " + shipping.calculate(thePackage));
        shipping.setStrategy(fedex);
        console.log("Fedex Strategy: " + shipping.calculate(thePackage));

        console.log(shipping);
    }

    console.log('\n\n------------------------\nSTRATEGY PATTERN:\nMy implementation using factory functions');
    run();

}());
