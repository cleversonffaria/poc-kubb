import { setupWorker } from 'msw/browser';
import { handlers } from '../../generated';
 
export const worker = setupWorker(...handlers);
