/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />


// here we're using the 'wall follower' algorithm
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower)

class WallFollowerRobotAlgorithm extends RobotAlgorithm {

	constructor(robot: Robot) {
		super(robot);
	}

	chooseDirectionAtJunction(openings) {
		var newDirection = this.robot.getNewDirection(this.robot.facing, 90);
		while (openings.indexOf(newDirection) == -1) {
			newDirection = this.robot.getNewDirection(newDirection, -90);
		}

		return newDirection;
	}
}
