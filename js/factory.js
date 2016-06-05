/**
 * Created by Usuario on 5/30/2016.
 */

(function () {
	function weaponFactory() {
		/**
		 * Object.assign function copies all enumerable properties
		 * (including private data if there is a getter) from one or several objects
		 * (received as the second parameter to the last one) to a target object.
		 * (the first parameter).
		 * The last object you pass in takes precedence if there are any property collisions.
		 * This is useful when you don't want to share the prototype between instances,
		 * as you would get with Object.create(), but rather have an independent
		 * copy of those properties for every object from the beginning
		 */
		if (typeof Object.assign != 'function') {
			Object.assign = function(target) {
				'use strict';
				if (target == null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}

				target = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source != null) {
						for (var key in source) {
							if (Object.prototype.hasOwnProperty.call(source, key)) {
								target[key] = source[key];
							}
						}
					}
				}
				return target;
			};
		}
		
		
		var internal = {
			list:[]
		};
		
		
		function create(options) {
			var weapon;
			var privateData = {
				serialNb: undefined,
				type :'Weapon',
				maxRounds: 10,
				rounds : 10,
				equipped : false,
				owner : null
			};
			var defaultValues = {
				name : undefined
			};
			var proto = {
				init : function(name) {
					privateData.serialNb = privateData.serialNb || internal.list.length;
					this.name = name || privateData.type + '_' + privateData.serialNb;
				},
				setOwner : function (character) {
					if(privateData.owner) {
						privateData.owner.equippedWeapon = null;
					}
					if(character.equippedWeapon) {
						character.equippedWeapon.equipped = false;
					}
					character.equippedWeapon = this;
					privateData.owner = character;
					privateData.equipped = true;
				},
				getOwner : function(){
					return privateData.owner || {name:'none'};
				},
				fire : function() {
					if (this.rounds > 0) {
						this.rounds--;
					}
				},
				reload : function() {
					this.rounds = privateData.maxRounds;
				}
			};
			// Here we combine the minimal common implementation of a weapon defined in the
			// proto object used as the prototype of the returned object,
			// with the provided options object when the create function is called.
			var bareWeapon = Object.create(proto);
			internal.list.push(bareWeapon);
			bareWeapon.init();
			
			weapon = Object.assign(bareWeapon, defaultValues, options);
			
			return weapon;
		}

		function getProducedItems() {
			return internal.list.slice(0);
		}

		function getProducedCount() {
			return internal.list.length;
		}

		return {
			create : create,
			getProducedItems : getProducedItems,
			getProducedCount : getProducedCount
		}

	}

	var factory = weaponFactory();
	var genWeaponA = factory.create();
	var genWeaponB = factory.create({name:'bat', damage:"a lot"});
	console.log(genWeaponA.getOwner().name);
	genWeaponA.setOwner( {
		name:'Billy "the Kid"',
		equippedWeapon: {
			name: 'knife'
		}
	});
	console.log(genWeaponA.getOwner().name);
	genWeaponA.fire();
	genWeaponA.fire();
	genWeaponA.fire();
	genWeaponA.reload();



	console.log(factory.getProducedItems().toString());
	console.log(factory.getProducedCount());
	console.log(genWeaponB);

}());