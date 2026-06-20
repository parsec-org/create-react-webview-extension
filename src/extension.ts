import * as vscode from 'vscode';
import * as path from 'node:path';
import { getWebviewContent } from './getWebviewContent.js';
import { Context } from './router.js';
import { appRouter } from './router.js';
import { attachRouterToPanel } from '@webview-rpc/host';

class ParsecChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'parsecChatView';

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'dist', 'webview')),
      ],
    };

    // attachRouterToPanel expects WebviewPanel, but WebviewView.webview
    // has the same postMessage/onDidReceiveMessage interface
    attachRouterToPanel(appRouter, webviewView as unknown as vscode.WebviewPanel, {
      vsContext: this.context,
    });

    getWebviewContent(this.context, webviewView.webview).then((html) => {
      webviewView.webview.html = html;
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new ParsecChatViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ParsecChatViewProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // Keep the command as a secondary entry (optional)
  const disposable = vscode.commands.registerCommand('parsec-react-webview.helloWorld', () => {
    vscode.commands.executeCommand('workbench.view.extension.parsec-chat');
  });

  context.subscriptions.push(disposable);
}
