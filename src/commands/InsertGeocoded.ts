// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

import { geocode } from '../Coordinate';

export function insertGeocoded() {
    try {
        let editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            throw new Error('You must place the cursor in a file');
        }
        vscode.window.showInputBox({
            prompt: 'Enter the address to geocode',
            placeHolder: 'Full address'
        }).then(async value => {
            try {
                if (value) {
                    const coordinate = await geocode(value);
                    editor = vscode.window.activeTextEditor;
                    if (editor === undefined) {
                        throw new Error('You must place the cursor in a file');
                    }
                    editor.edit(edit => editor && edit.replace(editor.selection, `${coordinate.lat},${coordinate.lng}`));
                } else {
                    vscode.window.showInformationMessage('No value');
                }
            } catch (error) {
                vscode.window.showInformationMessage(error.message);
            }
        });
    } catch (error) {
        vscode.window.showInformationMessage(error.message);
    }
}
