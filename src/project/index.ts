/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
import {LoggerAdapter} from '@franzzemen/logger-adapter';


export class EnhancedError extends Error {
  isOriginalError = true;


  constructor(error?: unknown, msg: string = '', public isLogged: boolean = false) {
    super(msg.length > 0 ? msg : error instanceof Error? error?.message : 'Unknown Error');
    if(error) {
      this.cause = error;
      this.isOriginalError = false;
    } else {
      this.isOriginalError = true;
    }
  }
}

/**
 * Create an enhanced error and log it, marking it as logged.  If the error is already enhanced, it will not log again.
 * This avoids the forever logs on error.
 * @param error
 * @param log
 */
export function logAndEnhanceError(log: LoggerAdapter, error?: unknown, message?: string): EnhancedError {
  let enhancedError = error as EnhancedError;
  if (!(error instanceof EnhancedError)) {
    enhancedError = new EnhancedError(error, message, false);
  }
  if (!enhancedError.isLogged) {
    log.error(enhancedError);
    enhancedError.isLogged = true;
  }
  return enhancedError;
}

