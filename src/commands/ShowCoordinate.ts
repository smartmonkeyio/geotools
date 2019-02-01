// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

import { Coordinate, extractCoordinates } from '../Coordinate';
import { getFaviconPath, getLogoPath } from './common';

let coordinatePanel: vscode.WebviewPanel;
let coordinates: Array<Coordinate> = [];

export function showCoordinate(context: vscode.ExtensionContext) {
    try {
        // The code you place here will be executed every time your command is executed
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            throw new Error('You must select a coordinate!');
        }
        const text = editor.document.getText(editor.selection);
        const coords = extractCoordinates(text);
        if (text.length === 0 || coords.length < 1) {
            throw new Error('You must select a coordinate!');
        }

        if (coordinatePanel === undefined) {
            // Create and show a new webview
            coordinatePanel = vscode.window.createWebviewPanel(
                'coordinate', // Identifies the type of the webview. Used internally
                'GeoTools - Coordinate', // Title of the panel displayed to the user
                vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
                {
                    enableScripts: true // Allow JS execution inside the webview
                }
            );
            coordinatePanel.onDidDispose(() => coordinatePanel = undefined as any);
            coordinatePanel.iconPath = getFaviconPath(context);
            coordinates = [];
        }
        coords.forEach(c => coordinates.push(c));
        coordinatePanel.webview.html = getCoordinateWebview(context, coordinates);
    } catch (error) {
        vscode.window.showInformationMessage(error.message);
    }
}

function getCoordinateWebview(context: vscode.ExtensionContext, coordinates: Array<Coordinate>) {
    return `
	<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
    integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
	 crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
    integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
	 crossorigin=""></script>
	<script src="https://cdn.jsdelivr.net/npm/@mapbox/polyline@1.0.0/src/polyline.min.js"></script>


</head>

<body style="padding:0px">
    <div id="mapid" style="width: 100vw; height: 100vh; top:0; left: 0"
    class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"
	 tabindex="0"></div>
	<a href="https://smartmonkey.io" target="_blank" style="position:absolute;bottom:40px;right:0;z-index:10000;width:250px;border:0px" >
		<img src="${getLogoPath(context)}"></img>
	</a>

	<script>
        var coordinates = ${JSON.stringify(coordinates)};
        var last = coordinates[coordinates.length - 1];
		var map = L.map('mapid').setView([last.lat, last.lng], 13);
		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO,' +
            ' NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		}).addTo(map);

		coordinates.forEach((coordinate, index) => {
            L.marker([coordinate.lat, coordinate.lng])
                .bindPopup("<b>Marker " + (index+1) + "</b>:<br/>" + coordinate.lat + ', ' + coordinate.lng)
                .addTo(map);
		});
	</script>
</body>

</html>
	`;
}
