function createImage(source, size) {
    var img = document.createElement('img');
    img.src = source;
    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.position = 'absolute';
    return img;
}
function cellToTile(cell) {
    var sum = 0;
    if (cell.openings.north) {
        sum += 8;
    }
    if (cell.openings.east) {
        sum += 4;
    }
    if (cell.openings.south) {
        sum += 2;
    }
    if (cell.openings.west) {
        sum += 1;
    }
    return sum.toString(16);
}
function tileToCell(tile) {
    var directions = { north: false, east: false, south: false, west: false };
    var power;
    while (tile > 0) {
        power = getLargestPowerOfTwo(tile);
        if (power == 8) {
            directions.north = true;
        }
        else if (power == 4) {
            directions.east = true;
        }
        else if (power == 2) {
            directions.south = true;
        }
        else if (power == 1) {
            directions.west = true;
        }
        tile -= power;
    }
    return directions;
}
function getLargestPowerOfTwo(number) {
    var result = 1;
    while (result < number) {
        result *= 2;
    }
    return result / 2;
}
