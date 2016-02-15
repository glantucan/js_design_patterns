/**
 * The objects participating in this pattern are:
 *      Context -- In sample code: Shipping
 *                  maintains a reference to the current Strategy object
 *                  supports interface to allow clients to request Strategy calculations
 *                  allows clients to change Strategy
 *      Strategy -- In sample code: ups, usps, fedex
 *                  implements the algorithm using the Strategy interface
 *
 */
(function () {
    'use strict';

    // FACTORY FOR CONTEXT OBJECTS
    function createShipping() {
        var proto,
            shipping;
        proto = {
			setStrategy: function (company) {
				this.company = company;
			},
			calculate: function (thePackage) {
				return (this.company)? this.company(thePackage) : "Can't calculate!";
			}
		};
		Object.freeze(proto);
        shipping = Object.create(proto);
        shipping.company = undefined;
        return shipping;
    }

    // STRATEGIES
    var ups = function(thePackage) {
		// calculations...
		return "$45.95";
    };

    var usps = function(thePackage) {
		// calculations...
		return "$39.40";
    };

    var fedex =  function(thePackage) {
		// calculations...
		return "$43.20";
	};

    function run() {
        var thePackage = { from: "76712", to: "10012", weigth: "lkg" };

        var shipping = createShipping();

        shipping.setStrategy(ups);
        console.log("UPS Strategy: " + shipping.calculate(thePackage));
        shipping.setStrategy(usps);
        console.log("USPS Strategy: " + shipping.calculate(thePackage));
		shipping.setStrategy= null;
        shipping.setStrategy(fedex);
		shipping.company = null;
        console.log("Fedex Strategy: " + shipping.calculate(thePackage));

        console.log(shipping);
    }

    console.log('\n\n------------------------\nSTRATEGY PATTERN:\nImplementation using the functional nature of javascript');
    run();

}());
