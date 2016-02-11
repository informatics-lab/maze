/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />


// here we're just using the 'random mouse' algorithm 
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Random_mouse_algorithm)

class RandomMouseRobotAlgorithm extends RobotAlgorithm {
	
	constructor(robot: Robot) {
		super(robot);
	}

	// simply choose a random direction at each junction (ignoring the way we've come from)
	chooseDirectionAtJunction(openings: Direction[]): Direction {
		var randomDirection = openings[Math.floor(Math.random() * openings.length)];
		return randomDirection;	
	}
}


