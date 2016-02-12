/// <reference path="../maze/firstPersonMaze.ts" />
/// <reference path="../viewers/mazeViewer.ts" />
/// <reference path="robotAlgorithm.ts" />
/// <reference path="randomMouseRobotAlgorithm.ts" />
/// <reference path="../maze/cell.ts" />

// A Robot to solve mazes. It is composed with a RobotAlgorithm - the type of which determines how it will
// go about solving the maze

class Robot {

	facing: Direction = Direction.S;

	private _renderer: RobotInMazeRenderer = null;
	private _maze: FirstPersonMaze = null;
	private _nSteps: number = 0;
	private _stop: boolean = false;
	private _robotAlgorithm: RobotAlgorithm;

	constructor() {
		// use random mouse as the default algorithm
		this._robotAlgorithm = new RandomMouseRobotAlgorithm(this);
	}

	set renderer(renderer: RobotInMazeRenderer) {
		this._renderer = renderer;
	}

	get renderer() {
		return this._renderer;
	}

	set robotAlgorithm(algorithm: RobotAlgorithm) {
		this._robotAlgorithm = algorithm;
	}

	get robotAlgorithm() {
		return this._robotAlgorithm;
	}

	set maze(maze: FirstPersonMaze) {
		this._maze = maze;
	}

	// calling this tells a robot to quit. Note that it won't stop immediately, but will finish the current 
	// iteration around the '_robotLoop' function. Therefore it is only safe to assume that the robot has 
	// finally finished after a delay equal to its 'robotDelay' in milliseconds
	quit(): void {
		this._stop = true;
	}

	callRobotLoopWithDelay(loopFunction: Function): void {
		var thisContext = this;
		setTimeout(function() {
			loopFunction.call(thisContext);
		}, this._renderer.delay);
	}

	// the main loop that the robot iterates through to solve the maze. Get current cell, decide which way
	// to turn next, move in that direction, update the display and check if we've finished or need to quit, or
	// should carry on
	robotLoop(): void {
		var cell: MazeSolvingCell = this._maze.getCurrentCell();
	
		// robot logic to decide which direction to face next 
		this.facing = this._robotAlgorithm.chooseDirection(cell);
	
		// move in chosen direction
		this._maze.move(this.facing);
  
		// update display
		this._renderer.render(cell);

		//check if we're at the exit, or if we need to stop, or if we carry on
		if (cell.isExit) {
			console.log("Arrived at exit in ", this._nSteps, " steps!");
			return;
		} else if (this._stop) {
			console.log("Robot told to stop. It travelled ", this._nSteps, " steps.");
			return;
		} else {
			this._nSteps++;
			document.getElementById("stepsSpan").innerHTML = this._nSteps + '';
			this.callRobotLoopWithDelay(this.robotLoop);
		}
	}

	// For a given cell get all directions which lead to another cell _ignoring the direction we've come from_
	// i.e. ignore the opening that is 180 degrees from our facing direction as we've just come from there!
	getNewOpenings(cell: MazeSolvingCell): Direction[] {
		var openDirections: Direction[] = cell.openings.getOpenDirections();

		//console.log("robot is in a cell with openings: ", allOpenings);
		var newOpenings: Direction[] = [];
		for (var direction in openDirections) {
			if (openDirections[direction] != this.getNewDirection(this.facing, 180)) {
				newOpenings.push(openDirections[direction]);
			}
		}

		//console.log("robot is in a cell with non-turn-around openings: ", newOpenings);
		return newOpenings;
	}

	// Look in the maze in a given direction. Gets back an array of cells that are visible in that direction.
	lookToDirection(direction: Direction): MazeSolvingCell[] {
		return this._maze.look(direction);
	}

	// Based on an initial direcion and a turn (in degrees), return the new direction.
	getNewDirection(currentDirection: Direction, turn: number): Direction {
		var directions = [Direction.N, Direction.E, Direction.S, Direction.W];
		var indexChange = turn / 90;
		var currentDirectionIndex = 0;
		for (var currentDirectionIndex = 0; currentDirectionIndex < directions.length; currentDirectionIndex++) {
			if (directions[currentDirectionIndex] == currentDirection) {
				break;
			}
		}

		var newDirectionIndex = (currentDirectionIndex + indexChange) % directions.length;
		return directions[newDirectionIndex];
	}
}

