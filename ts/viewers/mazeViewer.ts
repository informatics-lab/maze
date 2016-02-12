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
		// Convert maze to first person maze (so robot only knows about cells it can 'see' from
		// it's current position), and assign this to the robot.
		robot.maze = new FirstPersonMaze(maze, robot.robotAlgorithm.mazeSolvingCellFactory);

		// Create a renderer to show robot navigate maze. Importantly we use the updateRobotDisplay
		// function which is abstract here, and hence left up to the runtime subclass to implement. This
		// is where we tailor the view to the user's choice of maze viewer
		var robotInMazeRenderer: RobotInMazeRenderer = {
			delay: robotDelay,
			render: this.updateRobotDisplay
		};

		// Set the robot's renderer to the one we just created
		robot.renderer = robotInMazeRenderer;

		// If maze isn't already displayed then do so before we let the robot attempt it
		if (!this.mazeDisplayed) {
			this.displayMaze();
		}

		// Create the part of the display to hold the number of steps the robot has taken
		this.createNStepsDisplay();

		// Set the robot going by calling it's recursive loop method for the first time
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
