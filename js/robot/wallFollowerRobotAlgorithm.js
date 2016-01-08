// here we're using the 'wall follower' algorithm
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower)


// Define the WallFollowerRobotAlgorithm constructor
function WallFollowerRobotAlgorithm() {
  	// Call the parent constructor, making sure (using Function#call)
  	// that "this" is set correctly during the call
	RobotAlgorithm.call(this);
}

// Create a RandomMouseRobotAlgorithm.prototype object that inherits from RobotAlgorithm.prototype.
WallFollowerRobotAlgorithm.prototype = Object.create(RobotAlgorithm.prototype); 

// Set the "constructor" property to refer to WallFollowerRobotAlgorithm
WallFollowerRobotAlgorithm.prototype.constructor = WallFollowerRobotAlgorithm;

// Replace the "chooseDirectionAtJunction" method
WallFollowerRobotAlgorithm.prototype.chooseDirectionAtJunction = function(openings, robot){
	var newDirection = robot.turnToNewDirection(robot.facing, 90);
	while (openings.indexOf(newDirection) == -1) {
	    newDirection = robot.turnToNewDirection(newDirection, -90);
	}
	
	return newDirection;
};
