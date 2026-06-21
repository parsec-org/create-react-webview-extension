import * as vscode from 'vscode';
import * as path from 'node:path';
import { getWebviewContent } from './getWebviewContent.js';
import { Context } from './router.js';
import { appRouter } from './router.js';
import { attachRouterToPanel } from '@webview-rpc/host';
import { createLogger } from './utils/logger.js';
import { checkForUpdates } from './utils/checkForUpdates.js';

let log: (message: string) => void = () => {};
let logger: vscode.OutputChannel;

class WebviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'reactWebviewView';

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
  logger = vscode.window.createOutputChannel('React Webview');
  log = createLogger(context, logger);
  log('Extension activated');

  if (context.extensionMode === vscode.ExtensionMode.Development) {
    log('Running in Development mode');
  } else if (context.extensionMode === vscode.ExtensionMode.Production) {
    log('Running in Production mode');
    checkForUpdates(context, log);
  } else {
    log('Running in Test mode');
  }

  const provider = new WebviewViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(WebviewViewProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  const disposable = vscode.commands.registerCommand('react-webview.helloWorld', () => {
    vscode.commands.executeCommand('workbench.view.extension.react-webview');
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(logger);
}

export async function deactivate(): Promise<void> {
  try {
    log('Extension deactivated');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log(`Error during deactivation: ${message}`);
  } finally {
    if (logger) {
      logger.dispose();
    }
  }
}
