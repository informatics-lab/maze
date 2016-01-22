/// <reference path="../maze/maze.ts" />
/// <reference path="../maze/cell.ts" />

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

	abstract updateRobotDisplay(cell: Cell): void;

	abstract resetMazeView(): void;

	abstract supportsRobots(): boolean;
}
