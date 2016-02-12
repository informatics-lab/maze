/// <reference path="../maze/cell.ts" />
/// <reference path="mazeRobot.ts" />

// Robot 'brain' to be composed with a robot to decide how to solve the maze. This is the abstract
// class. The specific subclasses will attempt to solve a maze in differing ways. 
// Note that the chooseDirection method is the main engine method which delegates as appropriate
// to the other direction choosing methods based on what openings are available in the cell in question
// Default implementations are provided for dead ends, straights and turns, but subclasses must make a 
// decision on how to handle junctions.
abstract class RobotAlgorithm {

	robot: Robot;
	mazeSolvingCellFactory: MazeSolvingCellFactory;

	constructor(robot: Robot) {
		this.robot = robot;
		this.mazeSolvingCellFactory = new DefaultMazeSolvingCellFactory();
	}

	chooseDirection(cell: MazeSolvingCell): Direction {
		var direction: Direction;

		var newOpenings: Direction[] = this.robot.getNewOpenings(cell);

		if (newOpenings.length == 0) {
			direction = this.chooseDirectionAtDeadEnd();
		} else if (newOpenings.length == 1) {
			direction = this.chooseDirectionAtStraightOrTurn(newOpenings);
		} else {
			direction = this.chooseDirectionAtJunction(newOpenings);
		}

		return direction;
	}

	chooseDirectionAtDeadEnd(): Direction {
		return this.robot.getNewDirection(this.robot.facing, 180);
	}

	chooseDirectionAtStraightOrTurn(openings: Direction[]): Direction {
		return openings[0];
	}

	abstract chooseDirectionAtJunction(openings: Direction[]): Direction;
}





