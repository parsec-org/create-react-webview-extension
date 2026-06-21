import * as assert from 'node:assert';
import * as vscode from 'vscode';
import { checkForUpdates } from '../../utils/checkForUpdates.js';

function mockFetch(response: unknown, ok = true, statusText = 'OK') {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    ({
      ok,
      statusText,
      json: async () => response,
    }) as Response;
  return () => {
    globalThis.fetch = original;
  };
}

function mockContext(version: string, id = 'test-publisher.test-extension') {
  return {
    extension: {
      id,
      packageJSON: { version },
    },
  } as unknown as vscode.ExtensionContext;
}

suite('checkForUpdates', () => {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(msg);

  setup(() => {
    logs.length = 0;
  });

  test('does nothing when already on the latest version', async () => {
    const restore = mockFetch({
      results: [{ extensions: [{ versions: [{ version: '1.0.0' }] }] }],
    });

    await checkForUpdates(mockContext('1.0.0'), log);

    assert.deepStrictEqual(logs, []);
    restore();
  });

  test('shows update message when a newer version is available', async () => {
    const restore = mockFetch({
      results: [{ extensions: [{ versions: [{ version: '2.0.0' }] }] }],
    });
    let shownMessage: string | undefined;
    const originalShow = vscode.window.showInformationMessage;
    (vscode.window.showInformationMessage as unknown) = async (msg: string) => {
      shownMessage = msg;
      return undefined;
    };

    await checkForUpdates(mockContext('1.0.0'), log);

    assert.ok(shownMessage?.includes('2.0.0'));
    vscode.window.showInformationMessage = originalShow;
    restore();
  });

  test('installs extension when user clicks Update', async () => {
    const restore = mockFetch({
      results: [{ extensions: [{ versions: [{ version: '2.0.0' }] }] }],
    });
    let installedId: string | undefined;
    const originalShow = vscode.window.showInformationMessage;
    const originalExec = vscode.commands.executeCommand;
    (vscode.window.showInformationMessage as unknown) = async () => 'Update';
    (vscode.commands.executeCommand as unknown) = async (_cmd: string, id: string) => {
      installedId = id;
    };

    await checkForUpdates(mockContext('1.0.0', 'my.ext'), log);

    assert.strictEqual(installedId, 'my.ext');
    vscode.window.showInformationMessage = originalShow;
    vscode.commands.executeCommand = originalExec;
    restore();
  });

  test('logs error on fetch failure', async () => {
    const restore = mockFetch({}, false, 'Internal Server Error');

    await checkForUpdates(mockContext('1.0.0'), log);

    assert.ok(logs.some((l) => l.includes('Internal Server Error')));
    restore();
  });

  test('logs error when fetch throws', async () => {
    const original = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error('network down');
    };

    await checkForUpdates(mockContext('1.0.0'), log);

    assert.ok(logs.some((l) => l.includes('network down')));
    globalThis.fetch = original;
  });

  test('does nothing when marketplace returns no versions', async () => {
    const restore = mockFetch({ results: [{ extensions: [] }] });

    await checkForUpdates(mockContext('1.0.0'), log);

    assert.deepStrictEqual(logs, []);
    restore();
  });
});
