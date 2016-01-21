/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />


// here we're using the 'recursive backtracker' algorithm
// ([add reference here)

class RecursiveBacktrackingRobotAlgorithm extends RobotAlgorithm {

	currentCell: Cell = null;
	backtracking: boolean = false;

	constructor(robot: Robot) {
		super(robot);
	}

	chooseDirectionAtDeadEnd() {
		// update backtracking
		this.backtracking = true;
 	
		// use call to super to return direction
		return super.chooseDirectionAtDeadEnd();
	}

	chooseDirectionAtStraightOrTurn(openings) {
		// update backtracking
		if (this.currentCell.isEntry && this.backtracking) {
			this.backtracking = false;
		}
    
		// use call to super to return direction
		return super.chooseDirectionAtStraightOrTurn(openings);
	}

	chooseDirectionAtJunction(openings) {
		// pick random direction that is open and we haven't already visited
		var direction;
		var nonVisitedOpenings = [];
		var lineOpening
		for (var i = 0; i < openings.length; i++) {
			var cellThroughThatOpening = this.robot.lookToDirection(openings[i])[0];
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
	}

	chooseDirection(cell: Cell) {
		this.currentCell = cell;
		this.currentCell.robotVisited = true;
	
		// call super to get direction
		var direction = super.chooseDirection(cell);
	
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
}




