import { createRoot } from 'react-dom/client';
import { IS_DEV } from 'shared/constants';
import { App } from './App';

if (IS_DEV) {
  const { worker } = await import('./mocks');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

createRoot(document.getElementById('root')!).render(<App />);
