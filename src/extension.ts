// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { extractCoordinates, Coordinate } from './Coordinate';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "geotools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	let showPolyline = vscode.commands.registerCommand('extension.showPolyline', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			vscode.window.showInformationMessage('You must select a polyline!');
			return; // No open text editor
		}
		const text = editor.document.getText(editor.selection);
		if (text.length === 0) {
			vscode.window.showInformationMessage('You must select a polyline!');
			return; // No open text editor
		}

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'polyline', // Identifies the type of the webview. Used internally
			'GeoTools - Polyline', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true // Allow JS execution inside the webview
			} // Webview options. More on these later.
		);

		panel.webview.html = getPolylineWebView(context, text);
	});

	context.subscriptions.push(showPolyline);

	let coordinatePanel: vscode.WebviewPanel;
	let coordinates: Array<Coordinate> = [];
	let showCoordinate = vscode.commands.registerCommand('extension.showCoordinate', () => {
		try {
			// The code you place here will be executed every time your command is executed
			let editor = vscode.window.activeTextEditor;
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
						enableScripts: true, // Allow JS execution inside the webview
					} // Webview options. More on these later.
				);
				coordinatePanel.onDidDispose(() => coordinatePanel = undefined as any);
				coordinatePanel.iconPath = vscode.Uri.file(
					path.join(context.extensionPath, 'images', 'favicon.png')
				);
				coordinates = [];
			}
			coords.forEach(c => coordinates.push(c));
			coordinatePanel.webview.html = getCoordinateWebview(context, coordinates);
		}
		catch (error) {
			vscode.window.showInformationMessage(error.message);
		}
	});

	context.subscriptions.push(showCoordinate);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function getLogoPath(context: vscode.ExtensionContext) {
	// Get path to resource on disk
	const onDiskPath = vscode.Uri.file(
		path.join(context.extensionPath, 'images', 'powered_by_smartmonkey.png')
	);

	// And get the special URI to use with the webview
	return onDiskPath.with({ scheme: 'vscode-resource' });
}


function getPolylineWebView(context: vscode.ExtensionContext, polyline: string) {
	return `
	<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
	 crossorigin="" />
	<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
	 crossorigin=""></script>
	<script src="https://cdn.jsdelivr.net/npm/@mapbox/polyline@1.0.0/src/polyline.min.js"></script>


</head>

<body style="padding:0px">
	<div id="mapid" style="width: 100vw; height: 100vh; top:0; left: 0" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"
	 tabindex="0"></div>
	<a href="https://smartmonkey.io" target="_blank" style="position:absolute;bottom:40px;right:0;z-index:10000;width:250px;border:0px" >
		<img src="${getLogoPath(context)}"></img>
	</a>

	<script>
		var data = '${polyline}';
		var latlngs = polyline.decode(data);

		var map = L.map('mapid').setView([51.505, -0.09], 13);
		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		}).addTo(map);

		var polyline = L.polyline(latlngs, { color: 'red', weight: 5 }).addTo(map);
		// zoom the map to the polyline
		map.fitBounds(polyline.getBounds());
	</script>
</body>

</html>
	`;
}

function getCoordinateWebview(context: vscode.ExtensionContext, coordinates: Array<Coordinate>) {
	return `
	<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
	 crossorigin="" />
	<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
	 crossorigin=""></script>
	<script src="https://cdn.jsdelivr.net/npm/@mapbox/polyline@1.0.0/src/polyline.min.js"></script>


</head>

<body style="padding:0px">
	<div id="mapid" style="width: 100vw; height: 100vh; top:0; left: 0" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"
	 tabindex="0"></div>
	<a href="https://smartmonkey.io" target="_blank" style="position:absolute;bottom:40px;right:0;z-index:10000;width:250px;border:0px" >
		<img src="${getLogoPath(context)}"></img>
	</a>

	<script>
		var coordinates = ${JSON.stringify(coordinates)};
		var map = L.map('mapid').setView([coordinates[0].lat,coordinates[0].lng], 13);
		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		}).addTo(map);

		coordinates.forEach((coordinate, index) => {
			L.marker([coordinate.lat, coordinate.lng]).bindPopup("<b>Marker " + (index+1) + "</b>:<br/>" + coordinate.lat + ', ' + coordinate.lng).addTo(map);
		});
	</script>
</body>

</html>
	`;
}