/**
 * Created by Usuario on 04-Jun-16.
 */

(function () {

	// Instead of building long prototype chains based on inheritance, you can build objects based on behavior
	// You can then mix behaviours into final objects as you need. We'll use the following compose function for that
	function compose(destination, source) {
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				destination[key] = source[key];
			}
		}
		return destination;
	}

	/// Let's define the  behaviours
	var circleFns = {
		area: function() {
			return Math.PI * this.radius * this.radius;
		},
		grow: function() {
			this.radius++;
		},
		shrink: function() {
			this.radius--;
		}
	};

	var clickableFns = {
		hover: function() {
			console.log('hovering');
		},
		press: function() {
			console.log('button pressed');
		},
		release: function() {
			console.log('button released');
		},
		fire: function() {
			console.log('Set all the hell fire upon you')
		}
	};

	// and now let's mix them together
	var roundButton = compose({id:'My round button 1', radius:1}, compose(circleFns, clickableFns));

	console.log(roundButton);
	console.log(roundButton.area());
	roundButton.fire();

	// You may complain about the waste of memory and you would be right, so let's fix that:
	// The extend function will return a new object whose prototype will contain the properties
	// of the second parameter and will own the properties of the first (own and enumerable properties)
	function extend(propObj, proto) {
		var extended = Object.create(proto);
		for (var key in propObj) {
			if (propObj.hasOwnProperty(key)) {
				extended[key] = propObj[key];
			}
		}
		return extended;
	}
	roundButton2 = extend({id:'My round button 2', radius:5}, compose(circleFns, clickableFns));
	console.log(roundButton2);
	console.log(roundButton2.area());
	roundButton2.fire();

	// This can be easily combined into a chainable little library
	/**
	 * Composer is intended to help you creating objects based on mixins. And as its name suggest is based on
	 * composition rather than inheritance.
	 * You give it an object to start with (and empty object,{}, will suffice) and returns another one
	 * with a set of methods that help you compose the original with other objects. These methods are chainable
	 * as they all return the composer object whose functions have access to the cached object that has been
	 * constructed so far.
	 * The final output will be either an instance object (when using the instance getter) or a factory function
	 * (by using the factory getter). The chain of methods you use to compose objects must finnish with one of those
	 * two getter invocations
	 * It follows a couple of rules.
	 * 		1.- The prototype chain for the resulting object only go two levels deep.
	 * 			The idea is that final instances have their instance properties on themselves,
	 * 			and shared state and behaviour (functions) on its prototype. The second (which is the last one) prototype
	 * 			delegation level will hold the Object.prototype methods if present in any of the objects provided.
	 * 		2.- While extend and inherit are word used in the API they don't imply classical inheritance, their meaning
	 * 			is the one they have in common language.
	 * 		4.- It only considers own enumerable properties of the provided objects it's not intended as a general
	 * 			purpose deep cloning utility. As said before it only links to the Object.prototype if it was there,
	 * 			nothing else is taken from the prototype chain of those objects.
	 * 		5.- When copying properties if their value is a primitive that primitive is copied, if the value is
	 * 			a reference, the reference is copied (so it makes shallow copies, it's not a deep cloning utility)
	 * @param original
	 * @returns {{extendWith: Function, inheritFrom: Function, compose: Function, instance: *, factory: Function}}
	 * @constructor
	 */
	function Composer(original) {
		// Simple shallow copier. Internal function just to not repeat myself
		function mix(destination, source) {
			for (var key in source) {
				if (source.hasOwnProperty(key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		}

		// Lets make this function pure
		var cached = mix({},original);
		var privateMembers;
		console.log(Composer);
		return {
			/**
			 * The cached object will be extended with the extension object own enumerable properties
			 * The cached object will become the prototype of the returned object.
			 * @param extension
			 * @returns {object} the cached object extended with the new properties
			 */
			extendWith: function (extension) {
				var extended = Object.create(cached);
				cached = mix(extended, extension);
				/*for (var key in extension) {
					if (extension.hasOwnProperty(key)) {
						extended[key] = extension[key];
					}
				}
				cached = extended; */
				return this;
			},
			/**
			 * Adds the own enumerable proto properties to the cached object prototype
			 * @param proto
			 * @returns {object} the cached object with the proto object properties added to its prototype
			 */
			inheritFrom: function (proto) {
				var newProto;

				// ensure we don't write to the Object.prototype
				if (Object.getPrototypeOf(cached) !== Object.prototype) {
					newProto = mix(Object.getPrototypeOf(cached), proto);
					//newProto = Composer(Object.getPrototypeOf(cached)).compose(proto).instance;
				} else {
					newProto = proto;
				}

				var extended = Object.create(newProto);
				cached = mix(extended, cached);
				/*for (var key in cached) {
					if (cached.hasOwnProperty(key)) {
						extended[key] = cached[key];
					}
				}
				cached = extended;*/
				return this;
			},
			/**
			 * Adds the source own enumerable properties to the cached object.
			 * @param source
			 * @returns {compose}
			 */
			compose: function (source) {
				mix(cached, source);
				/*for (var key in source) {
					if (source.hasOwnProperty(key)) {
						cached[key] = source[key];
					}
				}*/
				return this;
			},
			/**
			 * Returns the cached object
			 * @returns {*}
			 */
			get instance() {
				return cached;
			},
			/**
			 * Returns a factory function which creates instances of the cached object.
			 * @returns {Function}
			 */
			get factory() {
				return function() {
					var inst = Object.create(Object.getPrototypeOf(cached));
					/*for (var key in cached) {
						if (cached.hasOwnProperty(key)) {
							inst[key] = cached[key];
						}
					}
					return inst;*/
					return mix(inst, cached);
				}
			}
		}
	}
	// So:
	roundButton3 = Composer({id:'My round button 3', radius:10}).inheritFrom(circleFns).inheritFrom(clickableFns).instance;
	console.log(roundButton3);
	console.log(roundButton3.area());
	roundButton3.fire();
	var roundBtnFactory = Composer(circleFns)
		.compose(clickableFns)
		.extendWith({id:'My round button 4', radius:50})
		.factory;
	var roundBtn = roundBtnFactory();
	console.log(roundBtn);
	console.log(roundBtn.area());
	roundBtn.fire();

	var roundBtnFactory2 = Composer(circleFns)
		.extendWith({id:'My round button 5', radius:100})
		.inheritFrom(clickableFns)
		.factory;
	var roundBtn2 = roundBtnFactory2();
	console.log(roundBtn2);
	console.log(roundBtn2.area());
	roundBtn2.fire();


}());