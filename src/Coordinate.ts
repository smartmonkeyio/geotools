import { decode } from '@mapbox/polyline';
import * as request from 'request-promise-native';

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
        throw new Error('An even amount of numbers expected');
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
        throw new Error('Latitude out of range');
    }
    if (coordinate.lng < -180 || coordinate.lng > 180) {
        throw new Error('Longitude out of range');
    }
}

/**
 * Checks that all positions of polyline are valid
 * @param polyline Polyline to validate
 */
export function validatePoyline(polyline: string) {
    decode(polyline).map((c: [number, number]) => ({
        lat: c[0],
        lng: c[1]
    })).forEach(validateCoordinate);
}

/**
 * Geocodes the string using Nominatim
 * @param query String to be geocoded
 */
export async function geocode(query: string): Promise<Coordinate> {
    const response = await request({
        uri: 'https://nominatim.openstreetmap.org/search',
        qs: {
            q: query,
            format: 'json'
        },
        headers: {
            'User-Agent': 'Geotools'
        },
        json: true
    });
    if (response.length === 0) {
        throw new Error('No result found');
    }
    const { lat, lon } = response[0];
    return { lat, lng: lon };
}
