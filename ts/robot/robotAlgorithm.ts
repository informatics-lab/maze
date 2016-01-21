/// <reference path="../maze/cell.ts" />
/// <reference path="mazeRobot.ts" />

abstract class RobotAlgorithm {

	robot: Robot;

	constructor(robot: Robot) {
		this.robot = robot;
	}

	chooseDirectionAtDeadEnd() {
		return this.robot.getNewDirection(this.robot.facing, 180);
	}

	chooseDirectionAtStraightOrTurn(openings) {
		return openings[0];
	}

	abstract chooseDirectionAtJunction(openings);

	chooseDirection(cell: Cell) {
		var direction: string;

		var newOpenings: CellOpenings[] = this.robot.getNewOpenings(cell);

		if (newOpenings.length == 0) {
			direction = this.chooseDirectionAtDeadEnd();
		} else if (newOpenings.length == 1) {
			direction = this.chooseDirectionAtStraightOrTurn(newOpenings);
		} else {
			direction = this.chooseDirectionAtJunction(newOpenings);
		}

		return direction;
	}
}





