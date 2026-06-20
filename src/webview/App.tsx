import './App.css';
import reactLogo from '../../assets/react.svg';
import { wrpc } from './wrpc';
import viteLogo from '../../assets/vite.svg';
import { Button } from '@/webview/components/ui/button.tsx';
import { ModeToggle } from '@/webview/components/ModeToggle.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/webview/components/ui/tooltip.tsx';
import { ArrowUpIcon } from 'lucide-react';
import { Separator } from '@/webview/components/ui/separator.tsx';
import { Fragment } from 'react';
import { toast } from '@/webview/components/ui/sonner.tsx';

function App() {
  const { data: count } = wrpc.useQuery('fetchCounter');
  const { data: workspaceName } = wrpc.useQuery('getWorkspaceName');
  const updateCount = wrpc.useMutation('incrementCounter');
  const showAlert = wrpc.useMutation('showAlert');

  const utils = wrpc.useUtils();
  const handleIncrement = async () => {
    updateCount.mutate(1, {
      onSuccess: () => utils.invalidate('fetchCounter'),
    });
  };

  const handleSendMessage = () => {
    toast('Hello from React!', { position: 'top-right' });
    showAlert.mutate('Hello from React!');
  };

  return (
    <Fragment>
      <ModeToggle />
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <div className="relative flex flex-row items-center justify-center bg-primary-foreground">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React + VSCode</h1>
        <h2>Workspace: {workspaceName}</h2>
        <div className="card">
          <Button variant="outline" onClick={handleIncrement}>
            count is {count}
          </Button>
          <p className="mt-2">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        <div className="flex items-center gap-4">
          <Button>Button</Button>
          <Button variant="outline" size="icon" aria-label="Submit">
            <ArrowUpIcon />
          </Button>
        </div>
        <Button onClick={handleSendMessage}>Send Message to VSCode</Button>
        <div className="flex items-center gap-2 text-sm md:gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Settings</span>
            <span className="text-xs text-muted-foreground">Manage preferences</span>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-1">
            <span className="font-medium">Account</span>
            <span className="text-xs text-muted-foreground">Profile & security</span>
          </div>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="hidden flex-col gap-1 md:flex">
            <span className="font-medium">Help</span>
            <span className="text-xs text-muted-foreground">Support & docs</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {(['left', 'top', 'bottom', 'right'] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-fit capitalize">
                  {side}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default App;
