import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/webview/context/ThemeProvider.tsx';
import { TooltipProvider } from '@/webview/components/ui/tooltip.tsx';
import { Toaster } from '@/webview/components/ui/sonner.tsx';
import { ErrorBoundary } from '@/webview/components/ErrorBoundary';

const Chat = lazy(() => import('./pages/Chat.tsx'));

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <TooltipProvider>
            <HashRouter>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen">Loading...</div>
                }
              >
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/chat" element={<Chat />} />
                </Routes>
              </Suspense>
            </HashRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
