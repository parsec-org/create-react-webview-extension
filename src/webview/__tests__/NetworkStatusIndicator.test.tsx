import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NetworkStatusIndicator } from '@/webview/components/NetworkStatusIndicator';

describe('NetworkStatusIndicator', () => {
  it('shows online status when navigator.onLine is true', () => {
    vi.stubGlobal('navigator', { onLine: true });
    render(<NetworkStatusIndicator />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('shows offline status when navigator.onLine is false', () => {
    vi.stubGlobal('navigator', { onLine: false });
    render(<NetworkStatusIndicator />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});
