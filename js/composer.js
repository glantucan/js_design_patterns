/**
 * Created by Usuario on 05-Jun-16.
 */
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
function composer(original) {
	'use strict';
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

	return {
		/**
		 * Adds an initialization function for using private data.
		 * @param closure A function that will be executed on the resulting object instantiation
		 * and create methods on the prototype that will be able to access the variables defined within
		 * the closure scope
		 * @returns {object}
		 */
		enclose: function (closure){
			this.init = closure;
			return this;
		},
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
			if (this.init) this.init.call(cached);
			return cached;
		},
		/**
		 * Returns a factory function which creates instances of the cached object.
		 * @returns {Function}
		 */
		get factory() {
			var composer = this;
			return function (options) {
				var inst = mix(Object.create(Object.getPrototypeOf(cached)), cached);
				/*for (var key in cached) {
				 if (cached.hasOwnProperty(key)) {
				 inst[key] = cached[key];
				 }
				 }
				 return inst;*/
				if (composer.init) composer.init.call(inst);
				return mix(inst, options);
			}
		}
	}
}