/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// here we're just using the 'random mouse' algorithm 
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Random_mouse_algorithm)
var RandomMouseRobotAlgorithm = (function (_super) {
    __extends(RandomMouseRobotAlgorithm, _super);
    function RandomMouseRobotAlgorithm(robot) {
        _super.call(this, robot);
    }
    RandomMouseRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        var randomDirection = openings[Math.floor(Math.random() * openings.length)];
        return randomDirection;
    };
    return RandomMouseRobotAlgorithm;
})(RobotAlgorithm);
