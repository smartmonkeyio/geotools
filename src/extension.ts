// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { insertGeocoded } from './commands/InsertGeocoded';
import { showCoordinate } from './commands/ShowCoordinate';
import { showPolyline } from './commands/ShowPolyline';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.showPolyline', () => showPolyline(context)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.showCoordinate', () => showCoordinate(context)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.insertGeocoded', insertGeocoded));
}

// this method is called when your extension is deactivated
export function deactivate() { }
