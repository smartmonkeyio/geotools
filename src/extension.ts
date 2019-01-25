// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
			'Polyline', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true // Allow JS execution inside the webview
			} // Webview options. More on these later.
		);

		panel.webview.html = getPolylineWebView(text);
	});

	context.subscriptions.push(showPolyline);

	let showCoordinate = vscode.commands.registerCommand('extension.showCoordinate', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			vscode.window.showInformationMessage('You must select a coordinate!');
			return; // No open text editor
		}
		const text = editor.document.getText(editor.selection);
		if (text.length === 0) {
			vscode.window.showInformationMessage('You must select a coordinate!');
			return; // No open text editor
		}

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'coordinate', // Identifies the type of the webview. Used internally
			'Coordinate', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true // Allow JS execution inside the webview
			} // Webview options. More on these later.
		);

		panel.webview.html = getCoordinateWebview(text);
	});

	context.subscriptions.push(showCoordinate);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function getPolylineWebView(polyline: string) {
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

<body>
	<div id="mapid" style="width: 100vw; height: 100vh; top:0; left: 0" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"
	 tabindex="0"></div>

	<script>
		var data = '${polyline}';
		var latlngs = polyline.decode(data);
		console.log(latlngs);

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

function getCoordinateWebview(coordinate: string) {
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

<body>
	<div id="mapid" style="width: 100vw; height: 100vh; top:0; left: 0" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom"
	 tabindex="0"></div>

	<script>
		var map = L.map('mapid').setView([${coordinate}], 13);
		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		}).addTo(map);

		L.marker([${coordinate}]).addTo(map);
	</script>
</body>

</html>
	`;
}