/// <reference path="maze/cell.ts" />

// Using a module allows us to create something like a static class
module MazeUtils {
	export function createImage(source: string, size: number): HTMLImageElement {
		var img = document.createElement('img');
		img.src = source
		img.style.width = size + 'px';
		img.style.height = size + 'px';
		img.style.position = 'absolute';
		return img;
	}

	export function getLargestPowerOfTwo(number: number): number {
		var result: number = 1;
		while (result <= number) {
			result *= 2;
		}

		return result / 2;
	}

	// The de-facto unbiased shuffle algorithm - the Fisher-Yates (aka Knuth) shuffle. 
	// See http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	export function shuffle<T>(array: T[]): T[] {
		var currentIndex: number = array.length
		var randomIndex: number;
		var temporaryValue: T; 

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}




