export interface Coordinate {
	lat: number;
	lng: number;
}

/**
 * Extract the numbers from a given string
 * @param text String to be processed
 */
function extractNumbers(text: string): Array<number> {
	const regex = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
	return (text.match(regex) || []).map(parseFloat);
}

/**
 * Parses and validates the coordinates extracted from the text
 * @param text String to be parsed
 */
export function extractCoordinates(text: string): Array<Coordinate> {
	const numbers = extractNumbers(text);
	if (numbers.length % 2 !== 0) {
		throw new Error("An even amount of numbers expected");
	}
	const coordinates: Array<Coordinate> = [];
	for (let i = 0; i < numbers.length; i += 2) {
		coordinates.push({
			lat: numbers[i],
			lng: numbers[i + 1]
		} as Coordinate);
	}
	coordinates.forEach(validateCoordinate);
	return coordinates;
}

/**
 * Throws an exception when the provided coordinate is not valid
 * @param coordinate 
 */
function validateCoordinate(coordinate: Coordinate) {
	if (coordinate.lat < -90 || coordinate.lat > 90) {
		throw new Error("Latitude out of range");
	}
	if (coordinate.lng < -180 || coordinate.lng > 180) {
		throw new Error("Longitude out of range");
	}
}