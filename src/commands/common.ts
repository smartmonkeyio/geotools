// The module 'vscode' contains the VS Code extensibility API
import * as path from 'path';
import * as vscode from 'vscode';

export function getLogoPath(context: vscode.ExtensionContext) {
    // Get path to resource on disk
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, 'images', 'powered_by_smartmonkey.png')
    );
    // And get the special URI to use with the webview
    return onDiskPath.with({ scheme: 'vscode-resource' });
}

export function getFaviconPath(context: vscode.ExtensionContext) {
    return vscode.Uri.file(
        path.join(context.extensionPath, 'images', 'favicon.png')
    );
}
