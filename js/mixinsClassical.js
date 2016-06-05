(function () {
	/* MIXINS
	 Traditionally, a mixin is a class that defines a set of functions. Mixin classes
	 are considered abstract in that they will not themselves be instantiated. Instead, their
	 functions are copied (or borrowed) by concrete classes as a means of inheriting behavior
	 without entering into a formal relationship.
	 In Javascript this so easily done and common that many people don't realize they are
	 using them.
	 */

	//
	//// EXAMPLE: Create a circular button
	//

	//// CLASSICAL WAY:
	// Common way of using mixins without realizing on it:
	var Button = function Button() {
		this.buttonId = 'default';
		//this.constructor.prototype.test = 'buttonTest'; // Weird way to set a prototype property if you want to force
														// the classical way of thinking
	};
	Button.prototype = { // THIS IS A MIXIN. Quite handy, yes?
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
			this.action.fire();
		},
		test: undefined,
		constructor :Button
	};
	//Button.prototype.constructor = Button; // Caveat: You have to set the constructor property manually

	// Most people will run to extend this Button whe they need them to be round ;)
	// You can't use mixins anymore. (You can with Object.assign as shown later, but it has caveats)
	var CircleButton = function Circle() {
		this.buttonId = 'circleDefault';
		this.radius = 10;
	};
	// here we'll use inheritance and a new mixin and the new ES5 Object.assign
	CircleButton.prototype = Object.create(Button.prototype);
	//CircleButton.prototype.constructor = CircleButton;
	CircleButton.prototype.area = function() {
		return Math.PI * this.radius * this.radius;
	};
	CircleButton.prototype.grow = function() {
		this.radius++;
	};
	CircleButton.prototype.shrink = function() {
		this.radius--;
	};
	
	
	var button = new Button();
	console.log(button);

	console.log(button.constructor == Button);

	var circleButton = new CircleButton();
	console.log(circleButton.constructor == CircleButton);
	console.log('The constructor of circleButton is \n\t' + circleButton.constructor);
	console.log(circleButton.area());
	circleButton.press();
	console.log(circleButton);
	
	
	// Although we can use the ES6 Object.assign to make inheritance more cute it has its own pitfalls
	// Object.assign only copies own enumerable properties, and getters create a new local variable with the 
	// value the property had when de assign was invoked. So loner than to step inheritance chains 
	// require more work
	var CircleButton2 = function Circle() {
		this.buttonId = 'circleDefault';
		this.radius = 10;
	};
	// here we'll use inheritance and a new mixin and the new ES5 Object.assign
	CircleButton2.prototype = Object.assign(Object.create(Button.prototype), { // THIS IS ANOTHER MIXIN
		area: function() {
			return Math.PI * this.radius * this.radius;
		},
		grow: function() {
			this.radius++;
		},
		shrink: function() {
			this.radius--;
		},
		constructor : CircleButton2 
	});
	
	
	
	////


}());
