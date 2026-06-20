import { initWRPC } from '@webview-rpc/host';
import type * as vscode from 'vscode';
import * as vscodeApi from 'vscode';
import z from 'zod';

export type Context = {
  vsContext: vscode.ExtensionContext;
};

export const { router, procedure } = initWRPC.context<Context>().create();

// Basic temporary storage for demonstration purposes. When the webview is reloaded, this will be reset.
let tempNumberStorage = 0;

export const appRouter = router({
  fetchCounter: procedure.resolve(() => {
    return tempNumberStorage;
  }),
  incrementCounter: procedure.input(z.number()).resolve(({ input }) => {
    tempNumberStorage += input;
    return tempNumberStorage;
  }),
  getWorkspaceName: procedure.resolve(({ ctx }) => {
    // Try multiple methods to get workspace name
    const workspaceName =
      vscodeApi.workspace.name ||
      vscodeApi.workspace.workspaceFolders?.[0]?.name ||
      ctx.vsContext.extensionPath.split('/').pop() ||
      'No workspace open';
    return workspaceName;
  }),
  showAlert: procedure.input(z.string()).resolve(({ input }) => {
    console.log('[Extension] Received message:', input);
    vscodeApi.window.showInformationMessage(input);
    return true;
  }),
});

export type AppRouter = typeof appRouter;
