/// <reference path="../maze/maze.ts" />
/// <reference path="../maze/cell.ts" />


interface RobotInMazeRenderer {
	delay: number;
	render: Function;
}


// Abstract superclass for maze viewers (displayers). Subclasses specifically decide how they will 
// display and reset the maze view, and how they will update the display of the robot as it solves the 
// maze. 

abstract class MazeViewer {

	maze: Maze;
	mazeDisplayed: boolean;
	container: HTMLDivElement;

	constructor(maze: Maze) {
		this.maze = maze;
		this.container = <HTMLDivElement>document.getElementById('mazeDisplay');
		this.mazeDisplayed = false;
	}

	abstract displayMaze(): void;

	showRobotInMaze(robot: Robot, maze: Maze, robotDelay: number): void {
		robot.maze = new FirstPersonMaze(maze);

		var robotInMazeRenderer: RobotInMazeRenderer = {
			delay: robotDelay,
			render: this.updateRobotDisplay
		};
		robot.renderer = robotInMazeRenderer;

		if (!this.mazeDisplayed) {
			this.displayMaze();
		}

		this.createNStepsDisplay();

		robot.callRobotLoopWithDelay(robot.robotLoop);
	}

	abstract updateRobotDisplay(cell: Cell): void;

	abstract resetMazeView(): void;

	abstract supportsRobots(): boolean;

	private createNStepsDisplay(): void {
		var stepsDiv = document.createElement('div');
		stepsDiv.id = "stepsDiv";
		stepsDiv.innerHTML = "Number of robot moves: <span id='stepsSpan'>0</span>";
		document.getElementById('mazeDisplay').appendChild(stepsDiv);
	}
}
