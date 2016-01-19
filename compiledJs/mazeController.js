/// <reference path="maze/maze.ts" />
/// <reference path="maze/firstPersonMaze.ts" />
/// <reference path="robot/mazeRobot.ts" />
/// <reference path="robot/robotAlgorithm.ts" />
/// <reference path="robot/randomMouseRobotAlgorithm.ts" />
/// <reference path="robot/wallFollowerRobotAlgorithm.ts" />
/// <reference path="robot/recursiveBacktrackingRobotAlgorithm.ts" />
/// <reference path="viewers/mazeViewer.ts" />
/// <reference path="viewers/borderMazeViewer.ts" />
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
        setTimeout(function () {
            fn.call(this);
        }, robot.updateDelay);
    }
    else {
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
    robot = new Robot(mazeForRobot, mazeViewer, userChoices.robotDelay);
    var robotAlgorithm = getRobotAlgorithm(userChoices.robotAlgorithm, robot);
    robot.setRobotAlgorithm(robotAlgorithm);
    robot.fake();
    robot.trySolvingMaze();
}
function getUserOptionChoices() {
    var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    var options = {
        mazeWidth: document.getElementById("mazeWidthInput").value,
        mazeHeight: document.getElementById("mazeHeightInput").value,
        robotDelay: document.getElementById("robotDelayInput").value,
        robotAlgorithm: robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value,
        mazeDisplay: mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value
    };
    // var mazeWidthInput: HTMLInputElement = document.getElementById("mazeWidthInput");
    // options.mazeWidth = mazeWidthInput.value;
    // var mazeHeightInput = document.getElementById("mazeHeightInput");
    // options.mazeHeight = mazeHeightInput.value;
    // var robotAlgorithmSelect = document.getElementById("robotAlgorithmSelect");
    // options.robotAlgorithm = robotAlgorithmSelect.options[robotAlgorithmSelect.selectedIndex].value;
    // var robotDelayInput = document.getElementById("robotDelayInput");
    // options.robotDelay = robotDelayInput.value;
    // var mazeDisplaySelect = document.getElementById("mazeDisplaySelect");
    // options.mazeDisplay = mazeDisplaySelect.options[mazeDisplaySelect.selectedIndex].value;
    return options;
}
function getMazeViewer(viewerType, maze) {
    if (viewerType == "borders") {
        return new BorderMazeViewer(maze);
    } //else if (viewerType == "images") {
    // 	return new ImageMazeViewer(maze);
    // } else if (viewerType == "compositeImages") {
    // 	return new CompositeImageMazeViewer(maze);
    // } else if (viewerType == "codes") {
    // 	return new CodesMazeViewer(maze);
    // }
}
// TODO Need to change this as currently robot algorithm needs a robot in constructor
function getRobotAlgorithm(algorithmType, robot) {
    if (algorithmType == "randomMouse") {
        return new RandomMouseRobotAlgorithm(robot);
    }
    else if (algorithmType == "wallFollower") {
        return new WallFollowerRobotAlgorithm(robot);
    } //else if (algorithmType == "recursiveBacktracking") {
    // 	return new RecursiveBacktrackingRobotAlgorithm(robot);
    // }
}
