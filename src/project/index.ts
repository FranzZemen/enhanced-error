/*
Created by Franz Zemen 11/04/2022
License Type: MIT
*/
import {LoggerAdapter} from '@franzzemen/logger-adapter';


export class EnhancedError extends Error {
  isOriginalError = true;


  constructor(error?: Error, protected msg: string = '', public isLogged: boolean = false) {
    super(msg.length > 0 ? msg : error?.message);
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
export function logAndEnhanceError(log: LoggerAdapter, error?: Error, message?: string): EnhancedError {
  let err = error as EnhancedError;
  if (!(error instanceof EnhancedError)) {
    err = new EnhancedError(error, message, false);
  }
  if (!err.isLogged) {
    log.error(err);
    err.isLogged = true;
  }
  return err;
}

