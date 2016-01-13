var robot;
var maze;
var userChoices;
var mazeViewer;

function generateMaze() {
	init(proceed);
}

function solveMaze() {
	init(solve);
}

function init(fn) {

	if (robot) {
		robot.quit();
		console.log("told robot to quit, about to call next function after a delay");
		setTimeout(function() { 
        	fn.call(this);
    	}, robot.updateDelay);
	} else {
		fn.call(this);
	}	
}

function proceed() {
	document.getElementById('robotOptionsDiv').style.display = 'block';

	// clear away any pre-existing maze
	document.getElementById("mazeDisplay").innerHTML = "";
	
	userChoices = getUserOptionChoices();

	maze = new Maze(userChoices.mazeWidth, userChoices.mazeHeight);

	mazeViewer = getMazeViewer(userChoices.mazeDisplay, maze);
	mazeViewer.displayMaze();
}

function solve() {
	console.log("starting solve function");
	userChoices = getUserOptionChoices();
	
	mazeViewer.resetMazeView();
	maze.reset();
	document.getElementById("mazeDisplay").innerHTML = "";
	
	var mazeForRobot = new FirstPersonMaze(maze);

	var robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm);
	robot = new Robot(mazeForRobot, mazeViewer, robotAlgorithm, userChoices.robotDelay);
	robot.trySolvingMaze();
}

function getUserOptionChoices() {
	var options = {}

	var mazeWidthInput = document.getElementById("mazeWidthInput");
	options.mazeWidth = mazeWidthInput.value;
	
	var mazeHeightInput = document.getElementById("mazeHeightInput");
	options.mazeHeight = mazeHeightInput.value;

	var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
	options.robotAlgorithm = robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value;
	
	var robotDelayInput = document.getElementById("robotDelayInput");
	options.robotDelay = robotDelayInput.value;
	
	var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
	options.mazeDisplay = mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value;

	return options;
}

function getMazeViewer(viewerType, maze) {
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

function getRobotAlgorithm(algorithmType) {
	if (algorithmType == "randomMouse") {
		return new RandomMouseRobotAlgorithm();
	} else if (algorithmType == "wallFollower") {
		return new WallFollowerRobotAlgorithm();
	} else if (algorithmType == "recursiveBacktracking") {
		return new RecursiveBacktrackingRobotAlgorithm();
	}
}