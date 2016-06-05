/**
 * Created by Usuario on 05-Jun-16.
 */
(function() {
	'use strict';

	var animal = {
		beBorn: function () {
			console.log('A new ' + this.species + ' has been born. We named her/him/it ' + this.name + '.');
		},
		die: function() {
			console.log(this.name + ' just died. There is one less ' + this.species + ' on the planet' );
			this.name = 'Dead ' + this.name;
			this.species = 'dead ' + this.species;
		}
	};

	var groundMovement = {
		walk: function () {
			console.log('This ' + this.species + ', named ' + this.name + ', is now walking!');
		},
		run: function () {
			console.log('This ' + this.species + ', named ' + this.name + ', is now running!');
		}
	};

	var waterMovement = {
		dive: function () {
			console.log('This ' + this.species + ', named ' + this.name + ', is now diving!');
		}
	};

	var underWaterMovement = {
		swim: function () {
			console.log('This ' + this.species + ', named ' + this.name + ', is now swimming!');
		}
	};

	var john = {
		name: 'John Doe',
		species: 'human'
	};

	var humanMaker = composer(animal)
		.enclose(function() {
			var message = 'Hi, I\'m a ' + this.species + ' and my name is ' + this.name + '.';
			Object.getPrototypeOf(this).speak = function () {
				console.log(message);
			};
		})
		.extendWith(john)
		.inheritFrom(groundMovement)
		.inheritFrom(waterMovement)
		.inheritFrom(underWaterMovement)
		.factory;
	var human = humanMaker({name: 'Óscar'});
	human.beBorn();
	human.walk();
	human.run();
	human.speak();
	human.swim();
	human.dive();
	human.die();
	human.walk();

	console.log(human);
}());

