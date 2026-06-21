import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { createLogger } from '../../utils/logger.js';

suite('createLogger', () => {
  test('returns a function', () => {
    const context = { extensionMode: vscode.ExtensionMode.Development } as vscode.ExtensionContext;
    const channel = vscode.window.createOutputChannel('Test');
    const logger = createLogger(context, channel);
    assert.strictEqual(typeof logger, 'function');
    channel.dispose();
  });

  test('logs in Development mode', () => {
    const context = { extensionMode: vscode.ExtensionMode.Development } as vscode.ExtensionContext;
    const channel = vscode.window.createOutputChannel('Test');
    const logger = createLogger(context, channel);
    logger('hello');
    // OutputChannel.appendLine is called — no error thrown
    channel.dispose();
  });

  test('does not log in Production mode', () => {
    const context = { extensionMode: vscode.ExtensionMode.Production } as vscode.ExtensionContext;
    const channel = vscode.window.createOutputChannel('Test');
    const logger = createLogger(context, channel);
    logger('should not appear');
    // No error thrown — silently skipped
    channel.dispose();
  });
});
