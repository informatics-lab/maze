/// <reference path="../maze/cell.ts" />
/// <reference path="robotAlgorithm" />
/// <reference path="mazeRobot" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// here we're using the 'wall follower' algorithm
// (https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower)
var WallFollowerRobotAlgorithm = (function (_super) {
    __extends(WallFollowerRobotAlgorithm, _super);
    function WallFollowerRobotAlgorithm(robot) {
        _super.call(this, robot);
    }
    WallFollowerRobotAlgorithm.prototype.chooseDirectionAtJunction = function (openings) {
        var newDirection = this.robot.getNewDirection(this.robot.facing, 90);
        while (openings.indexOf(newDirection) == -1) {
            newDirection = this.robot.getNewDirection(newDirection, -90);
        }
        return newDirection;
    };
    return WallFollowerRobotAlgorithm;
})(RobotAlgorithm);
