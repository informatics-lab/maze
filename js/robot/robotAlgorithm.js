// Define the RobotAlgorithm constructor
var RobotAlgorithm = function(robot) {
	this.newOpenings;
	this.cell;
};

// Add a couple of methods to RobotAlgorithm.prototype
RobotAlgorithm.prototype.chooseDirectionAtDeadEnd = function(robot){
	// default implementation for robot behaviour at a dead end - turn around!
	return robot.getNewDirection(robot.facing, 180);
};

RobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn = function(openings, robot){
	// default implementation for robot behaviour at a straight or turn - take the only
	// opening available (openings already disregard the one we've come from)
	return openings[0];
};

RobotAlgorithm.prototype.chooseDirectionAtJunction = function(openings, robot){
	console.log("abstract method for robot behaviour at a junction. Should not be called.");
};

RobotAlgorithm.prototype.chooseDirection = function(robot, cell){
	var direction;
	
	var newOpenings = robot.getNewOpenings(cell);
 
    if (newOpenings.length == 0) {
        direction = this.chooseDirectionAtDeadEnd(robot);
    } else if (newOpenings.length == 1) {
        direction = this.chooseDirectionAtStraightOrTurn(newOpenings, robot);
    } else {
        direction = this.chooseDirectionAtJunction(newOpenings, robot);
    }
    
    return direction;
};





