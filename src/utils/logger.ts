import * as vscode from 'vscode';

export function createLogger(context: vscode.ExtensionContext, logger: vscode.OutputChannel) {
  return (message: string) => {
    if (context.extensionMode === vscode.ExtensionMode.Development) {
      logger.appendLine(message);
    }
  };
}
