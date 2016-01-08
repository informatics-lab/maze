var robot;

function go(mazeWidth, mazeHeight) {

	if (robot) {
		robot.quit();
		
		setTimeout(function() { 
        	proceed()
    	}, robot.updateDelay);
	} else {
		proceed();
	}	
}

function proceed() {
	// clear away any pre-existing maze
	document.getElementById("mazeDisplay").innerHTML = "";
	
	var options = getUserOptionChoices();

	var maze = new Maze(options.mazeWidth, options.mazeHeight);

	var mazeViewer = getMazeViewer(options.mazeDisplay, maze);

	var mazeForRobot = new FirstPersonMaze(maze);

	var robotAlgorithm = getRobotAlgorithm(options.robotAlgorithm);
	robot = new Robot(mazeForRobot, mazeViewer, robotAlgorithm, options.robotDelay);
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