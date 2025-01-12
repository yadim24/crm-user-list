import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Используется при разработке
export const worker = setupWorker(...handlers);
