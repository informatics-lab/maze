/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />


// here we're using the 'recursive backtracker' algorithm:
// Draw a line behind us at all times unless backtracking. At a junction pick a random direction 
// that hasn't been explored yet (ignoring the direction we've come from). When we come to a dead
// end then turn around and start backtracking, erasing the line. Finish backtracking when we come
// to a junction which has openings that haven't yet been explored - i.e. go in one of these directions
// and resume drawing the line. When we get to the finish there will be a single solution marked out 
// by the line that we've drawn. This method will always find a solution if one exists, but it 
// won't necessarily be the shortest solution if they are multiple.

class RecursiveBacktrackingRobotAlgorithm extends RobotAlgorithm {

	currentCell: RecursiveBacktrackingCell = null;
	backtracking: boolean = false;

	constructor(robot: Robot) {
		super(robot);
		this.mazeSolvingCellFactory = new RecursiveBacktrackingCellFactory();
	}

	chooseDirection(cell: RecursiveBacktrackingCell): Direction {
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

	chooseDirectionAtDeadEnd(): Direction {
		// update backtracking
		this.backtracking = true;
	
		// use call to super to return direction
		return super.chooseDirectionAtDeadEnd();
	}

	chooseDirectionAtStraightOrTurn(openings: Direction[]): Direction {
		// update backtracking
		if (this.currentCell.isEntry && this.backtracking) {
			this.backtracking = false;
		}
	
		// use call to super to return direction
		return super.chooseDirectionAtStraightOrTurn(openings);
	}

	chooseDirectionAtJunction(openings: Direction[]): Direction {
		// pick random direction that is open and we haven't already visited
		var direction;
		var nonVisitedOpenings = [];
		var lineOpening
		for (var i = 0; i < openings.length; i++) {
			var cellThroughThatOpening = <RecursiveBacktrackingCell>this.robot.lookToDirection(openings[i])[0];
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
}




