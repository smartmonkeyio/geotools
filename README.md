# Geo Tools

This extension provides with a series of convenient tools to deal with geographical data.

## Features

* **GPS Coordinates visualization**: Display the selected GPS coordinate on a map inside VS Code.
    * The numbers will be automatically extracted from your selection.

![coordinate demo screenshot](images/docs/coordinate_example.gif)

* **Polyline visualization**:  Display an encoded [polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) on map inside VS Code.
    * The entire text selection is parsed as a polyline.

![polyline demo screenshot](images/docs/polyline_example.gif)

* **Insert geocoded address**: Select the option Insert `Insert geocoded coordinate` to insert coordinate of an address at the cursor's position.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Release Notes

### 1.3.1
- Add caching to geocoding function in order to reduce requests to Nominatim.

### 1.3.0
- Add `Insert geocoded address` command.

### 1.2.1
- Update documentation graphics.

### 1.1.0
- Parse coordinates among text
- Add coordinates shows all markers on a single map.
- Added popups to markers.
- Added coordinate and polyline values validation.
- Add multiple markers at once.
- Improve error management.

### 1.0.0
- Initial release of Geo Tools.

## Usage policy
By using this Visual Studio Code extension you agree to the following terms:
- [License](LICENSE)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

## Credits
Brought to you by the [SmartMonkey.io](https://smartmonkey.io) team.
