// here we're using the 'recursive backtracker' algorithm
// ([add reference here)


// Define the RecursiveBacktrackingRobotAlgorithm constructor
function RecursiveBacktrackingRobotAlgorithm() {
  	// Call the parent constructor, making sure (using Function#call)
  	// that "this" is set correctly during the call
	RobotAlgorithm.call(this);
	
	this.currentCell = null;
	this.backtracking = false;
}

// Create a RecursiveBacktrackingRobotAlgorithm.prototype object that inherits from RobotAlgorithm.prototype.
RecursiveBacktrackingRobotAlgorithm.prototype = Object.create(RobotAlgorithm.prototype); 

// Set the "constructor" property to refer to RecursiveBacktrackingRobotAlgorithm
RecursiveBacktrackingRobotAlgorithm.prototype.constructor = RecursiveBacktrackingRobotAlgorithm;

// Replace the "chooseDirectionAtDeadEnd" method
RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtDeadEnd = function(robot){
	// update backtracking
	this.backtracking = true;
 	
 	// use call to super to return direction
 	return RobotAlgorithm.prototype.chooseDirectionAtDeadEnd.call(this, robot);
}

// Replace the "chooseDirectionAtStraightOrTurn" method
RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn = function(openings, robot){
	// update backtracking
	if (this.currentCell.isEntry && this.backtracking) {
    	this.backtracking = false;
    }
    
    // use call to super to return direction
    return RobotAlgorithm.prototype.chooseDirectionAtStraightOrTurn.call(this, openings, robot);
}

// Replace the "chooseDirectionAtJunction" method
RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirectionAtJunction = function(openings, robot){
	
	// pick random direction that is open and we haven't already visited
	var direction;
	var nonVisitedOpenings = [];
	var lineOpening
	for (var i = 0; i < openings.length; i++) {
		var cellThroughThatOpening = robot.lookToDirection(openings[i])[0];
		if (!cellThroughThatOpening.robotVisited) {
			nonVisitedOpenings.push(openings[i]);
		}
		if (cellThroughThatOpening.lineDrawn) {
			lineOpening = openings[i];
		}
	}

	if (nonVisitedOpenings.length == 0) {
		// we've been down all routes. We're backtracking and need to follow the route with the line
		direction = lineOpening;	
	} else {
		// we've got at least one route that hasn't yet been explored. Pick one at random
		var randomDirection = nonVisitedOpenings[Math.floor(Math.random() * nonVisitedOpenings.length)];
		direction = randomDirection;	
		if (this.backtracking) {
			this.backtracking = false;
		}
	}
	
	return direction;
};

// Replace the "chooseDirection" method
RecursiveBacktrackingRobotAlgorithm.prototype.chooseDirection = function(robot, cell) {
	
	this.currentCell = cell;
	this.currentCell.robotVisited = true;
	
	// call super to get direction
	var direction = RobotAlgorithm.prototype.chooseDirection.call(this, robot, cell);
	
	// Before returning direction we need to update line drawing in order to help determine 
	// which direction to go in the future
	if (this.backtracking) {
		// we're backtracking. remove line
		this.currentCell.lineDrawn = false;
	} else {
		// we're going forwards. Draw line
		this.currentCell.lineDrawn = true;
	}
	
	return direction;
}




