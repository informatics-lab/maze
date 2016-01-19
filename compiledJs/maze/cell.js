/*
interface cell {
    visited: boolean;
    isExit: boolean;
    isEntry: boolean;
    openings: cellOpenings;
    id: string;
}
*/
var cell = (function () {
    function cell(i, j) {
        this.id = i + "," + j;
        this.visited = false;
        this.isExit = false;
        this.isEntry = false;
        this.openings = {
            north: false,
            east: false,
            south: false,
            west: false
        };
    }
    return cell;
})();
