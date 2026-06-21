import * as vscode from 'vscode';
import * as path from 'node:path';
import { getWebviewContent } from './getWebviewContent.js';
import { Context } from './router.js';
import { appRouter } from './router.js';
import { attachRouterToPanel } from '@webview-rpc/host';
import { createLogger } from './utils/logger.js';

const CLI_IDE_COMPANION_IDENTIFIER = 'parsec.parsec-vscode-ide-companion';
let log: (message: string) => void = () => {};
let logger: vscode.OutputChannel;
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

async function checkForUpdates(context: vscode.ExtensionContext, log: (message: string) => void) {
  try {
    const currentVersion = context.extension.packageJSON.version;

    // Fetch extension details from the VSCode Marketplace.
    const response = await fetch(
      'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json;api-version=7.1-preview.1',
        },
        body: JSON.stringify({
          filters: [
            {
              criteria: [
                {
                  filterType: 7, // Corresponds to ExtensionName
                  value: CLI_IDE_COMPANION_IDENTIFIER,
                },
              ],
            },
          ],
          // See: https://learn.microsoft.com/en-us/azure/devops/extend/gallery/apis/hyper-linking?view=azure-devops
          // 946 = IncludeVersions | IncludeFiles | IncludeCategoryAndTags |
          //       IncludeShortDescription | IncludePublisher | IncludeStatistics
          flags: 946,
        }),
      }
    );

    if (!response.ok) {
      log(`Failed to fetch latest version info from marketplace: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    const extension = data?.results?.[0]?.extensions?.[0];
    // The versions are sorted by date, so the first one is the latest.
    const latestVersion = extension?.versions?.[0]?.version;

    if (latestVersion && semver.gt(latestVersion, currentVersion)) {
      const selection = await vscode.window.showInformationMessage(
        `A new version (${latestVersion}) of the Parsec Companion extension is available.`,
        'Update to latest version'
      );
      if (selection === 'Update to latest version') {
        // The install command will update the extension if a newer version is found.
        await vscode.commands.executeCommand(
          'workbench.extensions.installExtension',
          CLI_IDE_COMPANION_IDENTIFIER
        );
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Error checking for extension updates: ${message}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  logger = vscode.window.createOutputChannel('Parsec React Webview Companion');
  log = createLogger(context, logger);
  log('Extension activated');
  // 判断当前模式
  if (context.extensionMode === vscode.ExtensionMode.Development) {
    log('扩展运行在开发模式 (Development)');
    // 加载开发环境配置，如使用本地 API
  } else if (context.extensionMode === vscode.ExtensionMode.Production) {
    log('扩展运行在生产模式 (Production)');
    // 加载生产环境配置，如使用线上 API
    checkForUpdates(context, log);
  } else {
    // ExtensionMode.Test 等其他情况
    log('扩展运行在测试模式 (Test)');
  }

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
  context.subscriptions.push(logger);
}

export async function deactivate(): Promise<void> {
  try {
    log('Extension deactivated');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log(`Failed to stop IDE server during deactivation: ${message}`);
  } finally {
    if (logger) {
      logger.dispose();
    }
  }
}
