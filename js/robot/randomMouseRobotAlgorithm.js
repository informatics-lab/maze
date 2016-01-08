// here we're just using the 'random mouse' algorithm 
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Random_mouse_algorithm)


// Define the RandomMouseRobotAlgorithm constructor
function RandomMouseRobotAlgorithm() {
  	// Call the parent constructor, making sure (using Function#call)
  	// that "this" is set correctly during the call
	RobotAlgorithm.call(this);
}

// Create a RandomMouseRobotAlgorithm.prototype object that inherits from RobotAlgorithm.prototype.
RandomMouseRobotAlgorithm.prototype = Object.create(RobotAlgorithm.prototype); 

// Set the "constructor" property to refer to RandomMouseRobotAlgorithm
RandomMouseRobotAlgorithm.prototype.constructor = RandomMouseRobotAlgorithm;

// Replace the "chooseDirectionAtJunction" method
RandomMouseRobotAlgorithm.prototype.chooseDirectionAtJunction = function(openings, robot){
	var randomDirection = openings[Math.floor(Math.random() * openings.length)];
	return randomDirection;	
};
