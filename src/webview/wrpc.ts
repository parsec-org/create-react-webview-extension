import { createWrpcClient } from '@webview-rpc/client';
import { withReactQuery } from '@webview-rpc/react-query';

import type { AppRouter } from '../router';

export const wrpc = withReactQuery<AppRouter>(createWrpcClient<AppRouter>());
