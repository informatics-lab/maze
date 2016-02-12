/// <reference path="maze/maze.ts" />
/// <reference path="maze/firstPersonMaze.ts" />
/// <reference path="maze/mazeGenerationAlgorithm" />
/// <reference path="maze/mazeGenerationGrowingTreeAlgorithm.ts" />
/// <reference path="maze/mazeGenerationPrimsAlgorithm" />
/// <reference path="robot/mazeRobot.ts" />
/// <reference path="robot/robotAlgorithm.ts" />
/// <reference path="robot/randomMouseRobotAlgorithm.ts" />
/// <reference path="robot/wallFollowerRobotAlgorithm.ts" />
/// <reference path="robot/recursiveBacktrackingRobotAlgorithm.ts" />
/// <reference path="viewers/mazeViewer.ts" />
/// <reference path="viewers/borderMazeViewer.ts" />

var robot: Robot;
var maze: Maze;
var mazeGenerationAlgorithm: MazeGenerationAlgorithm;
var userChoices;
var mazeViewer: MazeViewer;

// Entry point for maze generation
function generateMaze() {
	init(generate);
}

// Entry point for solving maze
function solveMaze() {
	init(solve);
}

function init(fn) {

	if (robot) {
		robot.quit();
		console.log("Pre-existing robot has been told to quit. Waiting for a timeout equal to the robot's update interval before proceeding.");
		setTimeout(function() { 
        	fn.call(this);
    	}, robot.renderer.delay);
	} else {
		fn.call(this);
	}	
}

function generate() {
	console.log("Starting maze generation.");

	// clear away any pre-existing maze
	document.getElementById("mazeDisplay").innerHTML = "";
	
	userChoices = getUserOptionChoices();

	mazeGenerationAlgorithm = getMazeGenerationAlgorithm(userChoices.mazeGenerationAlgorithm);
	maze = new Maze(userChoices.mazeWidth, userChoices.mazeHeight, mazeGenerationAlgorithm);
	mazeViewer = getMazeViewer(userChoices.mazeDisplay, maze);
	mazeViewer.displayMaze();
	console.log("Maze generation complete.")

	if (mazeViewer.supportsRobots()) {
		document.getElementById('robotOptionsDiv').style.display = 'block';
	} else {
		document.getElementById('robotOptionsDiv').style.display = 'none';
	}
}

function solve() {
	console.log("Starting maze solve function. Checking if a maze exists...");
	if (!maze) {
		// This shouldn't happen in the current design of HTML page as the solve maze button
		// only appears after a maze has been generated.
		console.log("Error: No maze exists to solve. Quitting.");
		return;
	}

	userChoices = getUserOptionChoices();
	
	// reset existing maze display before trying to solve (it may already be mid-solve from previous robot)
	mazeViewer.resetMazeView();
	document.getElementById("mazeDisplay").innerHTML = "";
	
	robot = new Robot();
	robot.robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm, robot);
	
	mazeViewer.showRobotInMaze(robot, maze, parseInt(userChoices.robotDelay));
}

function getUserOptionChoices() {

	var mazeWidthSelect = <HTMLSelectElement>document.getElementById("mazeWidthInput");
	var mazeHeightSelect = <HTMLSelectElement>document.getElementById("mazeHeightInput");
	var mazeGenerationAlgorithmSelect = <HTMLSelectElement>document.getElementById("mazeGenerationAlgorithmSelect");
	var robotDelaySelect = <HTMLSelectElement>document.getElementById("robotDelayInput");
	var robotAlgorithmSelect = <HTMLSelectElement>document.getElementById("robotAlgorithmSelect");
	var mazeDisplaySelect = <HTMLSelectElement>document.getElementById("mazeDisplaySelect");

	var options = {
		mazeWidth: mazeWidthSelect.value,
		mazeHeight: mazeHeightSelect.value,
		mazeGenerationAlgorithm: mazeGenerationAlgorithmSelect.options[mazeGenerationAlgorithmSelect.selectedIndex].value,
		robotDelay: robotDelaySelect.value,
		robotAlgorithm: robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value,
		mazeDisplay: mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value
	}

	return options;
}

function getMazeGenerationAlgorithm(algorithmType: string): MazeGenerationAlgorithm {
	if (algorithmType == "growingTree") {
		return new MazeGenerationGrowingTreeAlgorithm();
	} else if (algorithmType == "prims") {
		return new MazeGenerationPrimsAlgorithm();
	}
}

function getMazeViewer(viewerType: string, maze: Maze): MazeViewer {
	if (viewerType == "borders") {
		return new BorderMazeViewer(maze);
	 } else if (viewerType == "images") {
	 	return new ImageMazeViewer(maze);
	 } else if (viewerType == "compositeImages") {
	 	return new CompositeImageMazeViewer(maze);
	 } else if (viewerType == "codes") {
	 	return new CodesMazeViewer(maze);
	 }
}

function getRobotAlgorithm(algorithmType: string, robot: Robot): RobotAlgorithm {
	if (algorithmType == "randomMouse") {
		return new RandomMouseRobotAlgorithm(robot);
	} else if (algorithmType == "wallFollower") {
		return new WallFollowerRobotAlgorithm(robot);
	} else if (algorithmType == "recursiveBacktracking") {
		return new RecursiveBacktrackingRobotAlgorithm(robot);
	}
}